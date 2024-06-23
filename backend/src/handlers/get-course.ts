import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";

export const getCourseRequestSchema = z.object({
  courseId: z.string(),
});

export type GetCourseRequest = z.infer<typeof getCourseRequestSchema>;

export const getCourse = async (ctx: Ctx, request: GetCourseRequest) => {
  return courseStore.getCourse(ctx, request.courseId);
};
