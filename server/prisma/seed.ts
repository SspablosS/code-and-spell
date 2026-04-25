import fs from "fs";
import path from "path";

import { PrismaClient, Difficulty } from "@prisma/client";

type SeedLevel = {
  id: number;
  title: string;
  gridSize: number;
  initialState: unknown;
  goal: unknown;
  hints: string[];
};

const prisma = new PrismaClient();

function readLevels(): SeedLevel[] {
  const levelsPath = path.resolve(__dirname, "..", "..", "database", "seeds", "levels.json");
  const raw = fs.readFileSync(levelsPath, "utf8");
  return JSON.parse(raw) as SeedLevel[];
}

async function seedCommands() {
  const commands = [
    {
      name: "move",
      description: "Шаг вперёд",
      syntax: "move()",
      example: "move()",
      category: "movement"
    },
    {
      name: "turn_left",
      description: "Поворот налево",
      syntax: "turn_left()",
      example: "turn_left()",
      category: "movement"
    },
    {
      name: "turn_right",
      description: "Поворот направо",
      syntax: "turn_right()",
      example: "turn_right()",
      category: "movement"
    },
    {
      name: "collect",
      description: "Сбор предмета",
      syntax: "collect()",
      example: "collect()",
      category: "action"
    },
    {
      name: "repeat",
      description: "Цикл повторения",
      syntax: "repeat N:",
      example: "repeat 3:\n    move()",
      category: "control"
    }
  ] as const;

  for (const cmd of commands) {
    await prisma.command.upsert({
      where: { name: cmd.name },
      update: {
        description: cmd.description,
        syntax: cmd.syntax,
        example: cmd.example,
        category: cmd.category
      },
      create: cmd
    });
  }

  return commands.length;
}

async function seedLevels() {
  const levels = readLevels();

  for (const level of levels) {
    const difficulty: Difficulty =
      level.id <= 2 ? Difficulty.easy : level.id <= 4 ? Difficulty.medium : Difficulty.hard;

    await prisma.level.upsert({
      where: { id: level.id },
      update: {
        title: level.title,
        description: null,
        gridSize: level.gridSize,
        initialState: level.initialState as any,
        goalState: level.goal as any,
        difficulty,
        orderIndex: level.id,
        hints: level.hints
      },
      create: {
        id: level.id,
        title: level.title,
        description: null,
        gridSize: level.gridSize,
        initialState: level.initialState as any,
        goalState: level.goal as any,
        difficulty,
        orderIndex: level.id,
        hints: level.hints
      }
    });
  }

  return levels.length;
}

async function main() {
  const [commandsCount, levelsCount] = await Promise.all([seedCommands(), seedLevels()]);
  console.log(`[seed] Commands upserted: ${commandsCount}`);
  console.log(`[seed] Levels upserted: ${levelsCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("[seed] Failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });

