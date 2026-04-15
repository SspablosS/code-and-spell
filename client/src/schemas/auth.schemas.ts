import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Некорректный email"),
  username: z.string().min(3).max(50),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Пароль должен содержать букву и цифру")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
