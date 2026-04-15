import type { NextFunction, Request, Response } from "express";

import { logger } from "../config/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err);

  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  if (err instanceof Error) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }

  return res.status(500).json({ error: "Internal Server Error" });
}
