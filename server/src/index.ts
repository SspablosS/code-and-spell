import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { rateLimiter } from "./middleware/rateLimiter.middleware";
import { authRouter } from "./routes/auth.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(rateLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server started on port ${env.PORT}`);
});

