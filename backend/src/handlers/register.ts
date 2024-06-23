import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { PASSWORD_REGEX } from "../common/constants";
import * as userStore from "../data/user_store";
import { credentialSchema, profileSchema } from "../models";

export const registerUserRequestSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(20).regex(PASSWORD_REGEX),
});

export type RegisterUserRequest = z.infer<typeof registerUserRequestSchema>;

export const registerUser = async ({
  username,
  email,
  password,
}: RegisterUserRequest) => {
  const profile = profileSchema.parse({
    userId: uuidv7(),
    username,
    email,
    admin: email.includes("admin"),
  });

  const credential = credentialSchema.parse({
    email,
    password,
  });

  return userStore.createUser(profile, credential);
};
