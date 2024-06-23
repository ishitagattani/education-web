import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as enrollmentStore from "../data/enrollment_store";
import { enrollmentSchema } from "../models";

export const addEnrollmentRequestSchema = z.object({
  courseId: z.string(),
});

export type AddEnrollmentRequest = z.infer<typeof addEnrollmentRequestSchema>;

export const addEnrollment = async (
  ctx: Ctx,
  { courseId }: AddEnrollmentRequest
) => {
  return enrollmentStore.addEnrollment(
    enrollmentSchema.parse({
      courseId,
      userId: ctx.user!.userId,
    })
  );
};
