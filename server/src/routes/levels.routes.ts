import { Router } from "express";

import * as levelsController from "../controllers/levels.controller";
import { authenticateToken } from "../middleware/auth.middleware";

export const levelsRouter = Router();

levelsRouter.get("/", authenticateToken, levelsController.getLevels);
levelsRouter.get("/:id", authenticateToken, levelsController.getLevelById);
levelsRouter.post("/", levelsController.createLevel);
