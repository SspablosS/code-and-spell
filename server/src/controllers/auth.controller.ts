import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";

import { prisma } from "../db/prisma";
import { clearAuthCookie, setAuthCookie, signAuthJwt } from "../utils/jwtCookie";

function formatValidationErrors(errors: ReturnType<typeof validationResult>) {
  return errors.array().map((e) => ({ field: e.type === "field" ? e.path : "unknown", message: e.msg }));
}

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: formatValidationErrors(errors) });
  }

  const { email, username, password } = req.body as {
    email: string;
    username: string;
    password: string;
  };

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      username: username.trim(),
      passwordHash
    }
  });

  const token = signAuthJwt({ id: user.id, email: user.email, username: user.username });
  setAuthCookie(res, token);

  return res.status(201).json({ user: { id: user.id, email: user.email, username: user.username } });
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: formatValidationErrors(errors) });
  }

  const { email, password } = req.body as { email: string; password: string };
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signAuthJwt({ id: user.id, email: user.email, username: user.username });
  setAuthCookie(res, token);

  return res.status(200).json({ user: { id: user.id, email: user.email, username: user.username } });
}

export async function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ user: req.user });
}
