import { Router } from "express";

import * as authController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authenticateToken, authController.me);
