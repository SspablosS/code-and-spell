import { Router } from "express";

import * as progressController from "../controllers/progress.controller";
import { authenticateToken } from "../middleware/auth.middleware";

export const progressRouter = Router();

progressRouter.use(authenticateToken);
progressRouter.get("/stats", progressController.getStats);
progressRouter.get("/", progressController.getMyProgress);
progressRouter.put("/:levelId", progressController.upsertProgress);
