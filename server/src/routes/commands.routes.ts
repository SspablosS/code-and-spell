import { Router } from "express";

import * as commandsController from "../controllers/commands.controller";

export const commandsRouter = Router();

commandsRouter.get("/", commandsController.getCommands);
