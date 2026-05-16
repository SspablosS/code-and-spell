import crypto from "crypto";
import type { CookieOptions, Request, Response } from "express";

import {
  getGoogleCallbackUrl,
  GOOGLE_AUTH_SCOPES,
  isGoogleOAuthEnabled
} from "../config/google";
import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { setAuthCookie, signAuthJwt } from "../utils/jwtCookie";

const OAUTH_STATE_COOKIE = "oauth_state";
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

type GoogleTokenResponse = {
  access_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

type GoogleUserInfo = {
  id: string;
  email: string;
  verified_email?: boolean;
  name?: string;
  given_name?: string;
  picture?: string;
};

function oauthStateCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_MAX_AGE_MS,
    path: "/"
  };
}

function redirectToClient(res: Response, path: string) {
  const base = env.CLIENT_URL.replace(/\/$/, "");
  res.redirect(`${base}${path.startsWith("/") ? path : `/${path}`}`);
}

async function pickUsername(base: string): Promise<string> {
  const sanitized =
    base
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .slice(0, 24) || "player";

  let username = sanitized;
  let suffix = 0;

  while (await prisma.user.findFirst({ where: { username } })) {
    suffix += 1;
    username = `${sanitized.slice(0, 20)}${suffix}`;
  }

  return username;
}

export function googleAuthStart(_req: Request, res: Response) {
  if (!isGoogleOAuthEnabled()) {
    return res.status(503).json({ error: "Google OAuth is not configured" });
  }

  const state = crypto.randomBytes(24).toString("hex");
  res.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions());

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleCallbackUrl(),
    response_type: "code",
    scope: GOOGLE_AUTH_SCOPES.join(" "),
    state,
    access_type: "online",
    prompt: "select_account"
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

export async function googleAuthCallback(req: Request, res: Response) {
  if (!isGoogleOAuthEnabled()) {
    return redirectToClient(res, "/login?error=oauth_not_configured");
  }

  const errorParam = typeof req.query.error === "string" ? req.query.error : null;
  if (errorParam) {
    return redirectToClient(res, "/login?error=oauth_denied");
  }

  const code = typeof req.query.code === "string" ? req.query.code : null;
  const state = typeof req.query.state === "string" ? req.query.state : null;
  const savedState = req.cookies?.[OAUTH_STATE_COOKIE];

  res.clearCookie(OAUTH_STATE_COOKIE, oauthStateCookieOptions());

  if (!code || !state || !savedState || state !== savedState) {
    return redirectToClient(res, "/login?error=oauth_state");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: getGoogleCallbackUrl(),
        grant_type: "authorization_code"
      })
    });

    if (!tokenRes.ok) {
      console.error("[google oauth] token exchange failed", await tokenRes.text());
      return redirectToClient(res, "/login?error=oauth_token");
    }

    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    if (!userInfoRes.ok) {
      console.error("[google oauth] userinfo failed", await userInfoRes.text());
      return redirectToClient(res, "/login?error=oauth_profile");
    }

    const profile = (await userInfoRes.json()) as GoogleUserInfo;

    if (!profile.email || profile.verified_email === false) {
      return redirectToClient(res, "/login?error=oauth_email");
    }

    const email = profile.email.trim().toLowerCase();
    const googleId = profile.id;

    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      const byEmail = await prisma.user.findUnique({ where: { email } });

      if (byEmail) {
        if (byEmail.googleId && byEmail.googleId !== googleId) {
          return redirectToClient(res, "/login?error=oauth_account_conflict");
        }

        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: { googleId }
        });
      } else {
        const usernameBase = profile.given_name || profile.name || email.split("@")[0];
        const username = await pickUsername(usernameBase);

        user = await prisma.user.create({
          data: {
            email,
            username,
            googleId,
            passwordHash: null
          }
        });
      }
    }

    const token = signAuthJwt({
      id: user.id,
      email: user.email,
      username: user.username
    });
    setAuthCookie(res, token);

    return redirectToClient(res, "/levels");
  } catch (err) {
    console.error("[google oauth] callback error", err);
    return redirectToClient(res, "/login?error=oauth_failed");
  }
}
