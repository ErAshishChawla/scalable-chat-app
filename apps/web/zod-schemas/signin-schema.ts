import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
