import { Router } from "express";
import { body } from "express-validator";

import * as authController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email"),
  body("username").isString().trim().isLength({ min: 3, max: 50 }).withMessage("Invalid username"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Invalid password")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage("Password must contain a letter and a digit"),
  authController.register
);

authRouter.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isString().isLength({ min: 1 }).withMessage("Invalid password"),
  authController.login
);

authRouter.post("/logout", authController.logout);
authRouter.get("/me", authenticateToken, authController.me);
