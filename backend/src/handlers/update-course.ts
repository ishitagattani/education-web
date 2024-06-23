import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";
import { courseDetailsSchema } from "../models";

export const updateCourseRequestSchema = z.object({
  courseId: z.string(),
  courseDetails: courseDetailsSchema,
});

export type UpdateCourseRequest = z.infer<typeof updateCourseRequestSchema>;

export const updateCourse = async (
  ctx: Ctx,
  { courseId, courseDetails }: UpdateCourseRequest
) => {
  return courseStore.updateCourse(ctx, courseId, courseDetails);
};
