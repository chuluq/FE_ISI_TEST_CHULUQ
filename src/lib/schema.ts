import { z } from "zod";

export const roles = ["LEAD", "TEAM"] as const;

export const registrationSchema = z.object({
  username: z.string().trim().min(1, {
    message: "Username is required",
  }),
  email: z.string().trim().email({
    message: "Invalid email address",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
  role: z.enum(roles),
});

export type UserSchema = z.infer<typeof registrationSchema>;
