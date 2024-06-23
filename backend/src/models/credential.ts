import { z } from "zod";
import { PASSWORD_REGEX } from "../common/constants";

export const credentialSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20).regex(PASSWORD_REGEX),
});

export type Credential = z.infer<typeof credentialSchema>;
