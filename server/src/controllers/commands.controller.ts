import type { Request, Response } from "express";

import { prisma } from "../db/prisma";

export async function getCommands(req: Request, res: Response) {
  try {
    const commands = await prisma.command.findMany();

    return res.status(200).json({ commands });
  } catch (error) {
    console.error("Error fetching commands:", error);
    return res.status(500).json({ error: "Failed to fetch commands" });
  }
}
