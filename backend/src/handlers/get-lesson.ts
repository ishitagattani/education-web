import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";

export const getLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
});

export type GetLessonRequest = z.infer<typeof getLessonRequestSchema>;

export const getLesson = async (ctx: Ctx, request: GetLessonRequest) => {
  return courseStore.getLesson(ctx, request.courseId, request.lessonId);
};
