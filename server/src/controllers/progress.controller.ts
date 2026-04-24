import type { Request, Response } from "express";

import { prisma } from "../db/prisma";

export async function getMyProgress(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: req.user.id },
    include: { level: true },
    orderBy: { levelId: "asc" }
  });

  return res.status(200).json({ progress });
}

export async function upsertProgress(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const levelId = Number(req.params.levelId);
    if (!Number.isInteger(levelId) || levelId < 1) {
      return res.status(400).json({ error: "Invalid level id" });
    }

    const body = req.body as {
      isCompleted?: boolean;
      bestSolution?: string | null;
      attemptsCount?: number;
    };

    if (
      body.attemptsCount !== undefined &&
      (typeof body.attemptsCount !== "number" || !Number.isInteger(body.attemptsCount) || body.attemptsCount < 0)
    ) {
      return res.status(400).json({ error: "Invalid attemptsCount" });
    }

    const level = await prisma.level.findUnique({ where: { id: levelId } });
    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_levelId: {
          userId: req.user.id,
          levelId
        }
      }
    });

    const isCompleted = body.isCompleted;
    const completedAtForUpdate =
      isCompleted === true ? (existing?.completedAt ?? new Date()) : undefined;

    const userExists = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!userExists) {
      return res.status(401).json({ error: 'User not found, please login again' });
    }

    const record = await prisma.userProgress.upsert({
      where: {
        userId_levelId: {
          userId: req.user.id,
          levelId
        }
      },
      create: {
        userId: req.user.id,
        levelId,
        isCompleted: Boolean(isCompleted),
        bestSolution: body.bestSolution ?? null,
        attemptsCount: body.attemptsCount ?? 0,
        completedAt: isCompleted === true ? new Date() : null
      },
      update: {
        ...(typeof isCompleted === "boolean" ? { isCompleted } : {}),
        ...(body.bestSolution !== undefined ? { bestSolution: body.bestSolution } : {}),
        ...(typeof body.attemptsCount === "number" ? { attemptsCount: body.attemptsCount } : {}),
        ...(isCompleted === true && completedAtForUpdate
          ? { completedAt: completedAtForUpdate }
          : {})
      }
    });

    return res.status(200).json({ progress: record });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function getStats(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [completedLevels, sumRow] = await Promise.all([
    prisma.userProgress.count({
      where: { userId: req.user.id, isCompleted: true }
    }),
    prisma.userProgress.aggregate({
      where: { userId: req.user.id },
      _sum: { attemptsCount: true }
    })
  ]);

  const totalAttempts = sumRow._sum.attemptsCount ?? 0;

  return res.status(200).json({
    stats: {
      completedLevels,
      totalAttempts
    }
  });
}
