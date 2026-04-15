import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { z } from "zod";

function loadDotenvFiles() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
    path.resolve(__dirname, "..", "..", "..", ".env"),
    path.resolve(__dirname, "..", "..", ".env")
  ];

  const seen = new Set<string>();
  for (const filePath of candidates) {
    if (seen.has(filePath)) continue;
    seen.add(filePath);

    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath });
    }
  }
}

loadDotenvFiles();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1).default("24h"),
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_URL: z.string().min(1),
  SENTRY_DSN_SERVER: z.string().optional().default("")
});

export const env = envSchema.parse(process.env);

