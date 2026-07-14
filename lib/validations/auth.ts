import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email("Enter a valid email address, like you@example.com."),
  password: z
    .string()
    .min(8, "Use 8 or more characters with a mix of letters and numbers."),
});
