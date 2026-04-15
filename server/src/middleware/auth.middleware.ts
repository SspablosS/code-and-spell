import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

type JwtUserPayload = {
  id: number;
  email: string;
  username: string;
};

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
    if (typeof decoded === "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = decoded as jwt.JwtPayload & Partial<JwtUserPayload>;
    if (
      typeof payload.id !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.username !== "string"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = { id: payload.id, email: payload.email, username: payload.username };
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
