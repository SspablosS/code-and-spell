import { env } from "./env";

export function isGoogleOAuthEnabled(): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export function getGoogleCallbackUrl(): string {
  const base = env.CLIENT_URL.replace(/\/$/, "");
  return `${base}/api/auth/google/callback`;
}

export const GOOGLE_AUTH_SCOPES = ["openid", "email", "profile"] as const;
