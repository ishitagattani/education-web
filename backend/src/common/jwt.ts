import { addMilliseconds } from "date-fns";
import jwt from "jsonwebtoken";
import ms from "ms";
import { z } from "zod";

export const claimsSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});

export type Claims = z.infer<typeof claimsSchema>;

export const tokenSchema = z.object({
  token: z.string(),
  expirationDate: z.coerce.date(),
});

export type Token = z.infer<typeof tokenSchema>;

export function makeToken(claims: Claims): Token {
  const expirationDate = addMilliseconds(
    new Date(),
    ms(process.env.ACCESS_TOKEN_EXPIRATION_DURATION!)
  );
  const token = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_DURATION,
  });

  return {
    token,
    expirationDate,
  } satisfies Token;
}

export function verifyToken(token: string): Claims {
  try {
    const claims = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return claimsSchema.parse(claims);
  } catch (e: unknown) {
    throw new Error("invalid token");
  }
}
