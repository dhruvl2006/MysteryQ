import { z } from "zod";

export const resetPassword = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
  confirmPassword: z.string(),
});
