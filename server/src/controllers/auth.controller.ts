import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { Request, Response } from "express";
import type { ZodError } from "zod";
import { Resend } from 'resend';

import { prisma } from "../db/prisma";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
import { clearAuthCookie, setAuthCookie, signAuthJwt } from "../utils/jwtCookie";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  if (!user.passwordHash) {
    return res.status(401).json({ error: "This account uses Google sign-in" });
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

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    // Всегда возвращаем успех для безопасности (чтобы не раскрывать существование email)
    return res.status(200).json({ message: "Если email существует, ссылка для сброса отправлена" });
  }

  if (!user.passwordHash) {
    return res.status(400).json({ error: "Этот аккаунт использует Google авторизацию" });
  }

  // Генерируем токен
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires
    }
  });

  // Отправляем email через Resend
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Сброс пароля',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6c63ff;">Сброс пароля</h2>
          <p>Вы запросили сброс пароля для вашего аккаунта в Code & Spell.</p>
          <p>Для сброса пароля перейдите по ссылке ниже:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6c63ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Сбросить пароль</a>
          <p>Ссылка действительна в течение 15 минут.</p>
          <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    // Не прерываем процесс, если email не отправлен
  }

  return res.status(200).json({ message: "Ссылка для сброса отправлена на вашу почту" });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date()
      }
    }
  });

  if (!user) {
    return res.status(400).json({ error: "Недействительный или истекший токен" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });

  return res.status(200).json({ message: "Пароль успешно изменен" });
}
