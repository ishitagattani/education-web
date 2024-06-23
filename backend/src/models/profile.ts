import { z } from "zod";

export const profileSchema = z.object({
  userId: z.string(),
  username: z.string().min(1).max(20),
  email: z.string().email(),
  admin: z.boolean(),
});

export type Profile = z.infer<typeof profileSchema>;
