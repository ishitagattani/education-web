import { z } from "zod";
import * as userStore from "../data/user_store";

export const userProfileRequestSchema = z.object({
  userId: z.string(),
});

export type UserProfileRequest = z.infer<typeof userProfileRequestSchema>;

const userProfileResponseSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  admin: z.boolean(),
});

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;

export const getUserProfile = async ({ userId }: UserProfileRequest) => {
  const profile = await userStore.getProfile(userId);

  return userProfileResponseSchema.parse(profile);
};
