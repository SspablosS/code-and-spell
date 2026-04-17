import type { Request, Response } from "express";

import { prisma } from "../db/prisma";

export async function getLevels(req: Request, res: Response) {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { orderIndex: "asc" }
    });

    return res.status(200).json({ levels });
  } catch (error) {
    console.error("Error fetching levels:", error);
    return res.status(500).json({ error: "Failed to fetch levels" });
  }
}

export async function getLevelById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid level id" });
    }

    const level = await prisma.level.findUnique({
      where: { id }
    });

    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    return res.status(200).json({ level });
  } catch (error) {
    console.error("Error fetching level:", error);
    return res.status(500).json({ error: "Failed to fetch level" });
  }
}

export async function createLevel(req: Request, res: Response) {
  try {
    const body = req.body as {
      title: string;
      description?: string;
      gridSize?: number;
      initialState: any;
      goalState: any;
      difficulty?: string;
      orderIndex: number;
    };

    const level = await prisma.level.create({
      data: {
        title: body.title,
        description: body.description,
        gridSize: body.gridSize ?? 10,
        initialState: body.initialState,
        goalState: body.goalState,
        difficulty: (body.difficulty as any) ?? "medium",
        orderIndex: body.orderIndex
      }
    });

    return res.status(201).json({ level });
  } catch (error) {
    console.error("Error creating level:", error);
    return res.status(500).json({ error: "Failed to create level" });
  }
}
