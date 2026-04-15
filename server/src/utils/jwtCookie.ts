import type { CookieOptions, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

export function jwtExpiresInToMaxAgeMs(expiresIn: string): number {
  const match = /^(\d+)([smhd])$/i.exec(expiresIn.trim());
  if (!match) {
    return 24 * 60 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: jwtExpiresInToMaxAgeMs(env.JWT_EXPIRES_IN)
  };
}

export function signAuthJwt(user: { id: number; email: string; username: string }) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    algorithm: "HS256"
  };

  return jwt.sign({ id: user.id, email: user.email, username: user.username }, env.JWT_SECRET, options);
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, getAuthCookieOptions());
}

export function clearAuthCookie(res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
}
