import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 Characters")
  .max(15, "Username should be less than 15 Characters")
  .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});
