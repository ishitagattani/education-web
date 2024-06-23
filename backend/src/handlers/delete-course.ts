import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";

export const deleteCourseRequestSchema = z.object({
  courseId: z.string(),
});

export type DeleteCourseRequest = z.infer<typeof deleteCourseRequestSchema>;

export const deleteCourse = async (ctx: Ctx, request: DeleteCourseRequest) => {
  return courseStore.deleteCourse(ctx, request.courseId);
};
