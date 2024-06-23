import { z } from "zod";
import { PASSWORD_REGEX } from "../common/constants";
import { makeToken, tokenSchema } from "../common/jwt";
import * as userStore from "../data/user_store";

export const loginUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20).regex(PASSWORD_REGEX),
});

export type LoginUserRequest = z.infer<typeof loginUserRequestSchema>;

const loginUserResponseSchema = z.object({
  accessToken: tokenSchema,
});

export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;

export const loginUser = async ({ email, password }: LoginUserRequest) => {
  const savedCredentials = await userStore.getSavedCredentials(email);

  if (password !== savedCredentials.password)
    throw new Error("invalid credentials");

  const profile = await userStore.getProfileByEmail(email);

  const accessToken = makeToken({
    userId: profile.userId,
    email: profile.email,
    role: profile.admin ? "admin" : "user",
  });

  return loginUserResponseSchema.parse({
    accessToken,
  });
};
