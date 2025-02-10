import { z } from "zod";

export const roles = ["LEAD", "TEAM"] as const;
export const status = ["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"] as const;

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

export const loginSchema = z.object({
  email: z.string().trim().email({
    message: "Invalid email address",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});

export const todoSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Title is required",
  }),
  status: z.enum(status),
  created_by: z.number().min(1, {
    message: "Creator is required",
  }),
  assigned_to: z.number().min(1, {
    message: "Assignee is required",
  }),
});

export const updateTodoSchema = z.object({
  id: z.number().min(1, {
    message: "Task id is required",
  }),
  title: z.string().trim().min(1, {
    message: "Title is required",
  }),
  description: z.string().trim().optional(),
  status: z.union([
    z.literal("NOT_STARTED"),
    z.literal("ON_PROGRESS"),
    z.literal("DONE"),
    z.literal("REJECT"),
  ]),
  created_by: z.number().min(1, {
    message: "Creator is required",
  }),
  assigned_to: z.number().min(1, {
    message: "Assignee is required",
  }),
});
