import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import type { ZodError } from "zod";

import { prisma } from "../db/prisma";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
import { clearAuthCookie, setAuthCookie, signAuthJwt } from "../utils/jwtCookie";

function validationErrorMessage(error: ZodError): string {
  const first = error.issues[0];
  return first?.message ?? "Invalid input";
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: validationErrorMessage(parsed.error) });
  }

  const { email, username, password } = parsed.data;
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
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: validationErrorMessage(parsed.error) });
  }

  const { email, password } = parsed.data;
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
