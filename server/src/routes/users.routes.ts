import { Router } from "express";

import * as usersController from "../controllers/users.controller";
import { authenticateToken } from "../middleware/auth.middleware";

export const usersRouter = Router();

usersRouter.use(authenticateToken);
usersRouter.get("/:id/progress", usersController.getUserProgress);
usersRouter.get("/:id", usersController.getProfile);
