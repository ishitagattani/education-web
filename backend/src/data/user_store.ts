import {
  Credential,
  Profile,
  credentialSchema,
  profileSchema,
} from "../models";
import { db } from "./db";

export const createUser = async (
  profile: Profile,
  credential: Credential
): Promise<void> => {
  try {
    await db
      .insertInto("users")
      .values({
        user_id: profile.userId,
        username: profile.username,
        email: profile.email,
        admin: profile.admin,
        password: credential.password,
      })
      .execute();
  } catch (error: any) {
    if (error.code === "23505") {
      // unique_violation
      throw new Error("user already exists.");
    }
    console.error("[PostgresUserStore.createUser]", error);
    throw new Error("unexpected error");
  }
};

export const getSavedCredentials = async (
  email: string
): Promise<Credential> => {
  try {
    const row = await db
      .selectFrom("users")
      .select(["password"])
      .where("email", "=", email)
      .executeTakeFirst();

    if (!row) {
      throw new Error("user not found");
    }

    const credential = credentialSchema.parse({
      password: row.password,
      email,
    });
    return credential;
  } catch (error: unknown) {
    console.error("[PostgresUserStore.getSavedCredentials]", error);
    throw new Error("unexpected error");
  }
};

export const getProfileByEmail = async (email: string): Promise<Profile> => {
  try {
    const row = await db
      .selectFrom("users")
      .select(["user_id", "username", "email", "admin"])
      .where("email", "=", email)
      .executeTakeFirst();

    if (!row) {
      throw new Error("user not found");
    }

    const profile = profileSchema.parse({
      userId: row.user_id,
      username: row.username,
      email: row.email,
      admin: row.admin,
    });
    return profile;
  } catch (error: unknown) {
    console.error("[PostgresUserStore.getProfileByEmail]", error);
    throw new Error("unexpected error");
  }
};

export const getProfile = async (userId: string): Promise<Profile> => {
  try {
    const row = await db
      .selectFrom("users")
      .select(["username", "email", "admin"])
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (!row) {
      throw new Error("user not found");
    }

    const profile = profileSchema.parse({
      userId,
      username: row.username,
      email: row.email,
      admin: row.admin,
    });
    return profile;
  } catch (error: unknown) {
    console.error("[PostgresUserStore.getProfile]", error);
    throw new Error("unexpected error");
  }
};
