import { z } from "zod";
import * as enrollmentStore from "../data/enrollment_store";

export const getEnrollmentsForUserRequestSchema = z.object({
  userId: z.string(),
});

export type GetEnrollmentsForUserRequest = z.infer<
  typeof getEnrollmentsForUserRequestSchema
>;

export const getEnrollmentsForUserResponseSchema = z.object({
  courseIds: z.array(z.string()),
});

export type GetEnrollmentsForUserResponse = z.infer<
  typeof getEnrollmentsForUserResponseSchema
>;

export const getEnrollmentsForUser = async ({
  userId,
}: GetEnrollmentsForUserRequest) => {
  const enrollments = await enrollmentStore.getEnrollmentsForUser(userId);

  getEnrollmentsForUserResponseSchema.parse({
    courseIds: enrollments.map((enrollment) => enrollment.courseId),
  });
};
