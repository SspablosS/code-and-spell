import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { initSentry } from "./config/sentry";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { authRouter } from "./routes/auth.routes";
import { commandsRouter } from "./routes/commands.routes";
import { levelsRouter } from "./routes/levels.routes";
import { progressRouter } from "./routes/progress.routes";
import { usersRouter } from "./routes/users.routes";

// Инициализируем Sentry если настроен
initSentry();

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
// app.use(rateLimiter); // Отключено для разработки

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);
app.use("/api/levels", levelsRouter);
app.use("/api/commands", commandsRouter);

app.use(errorHandler);

export default app;
