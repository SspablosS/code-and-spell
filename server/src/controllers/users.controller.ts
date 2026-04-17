import type { Request, Response } from "express";

import { prisma } from "../db/prisma";

export async function getProfile(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ user });
}

export async function getUserProgress(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: id },
    include: { level: true },
    orderBy: { levelId: "asc" }
  });

  return res.status(200).json({ progress });
}
