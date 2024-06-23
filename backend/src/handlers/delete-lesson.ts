import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";

export const deleteLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
});

export type DeleteLessonRequest = z.infer<typeof deleteLessonRequestSchema>;

export const deleteLesson = async (ctx: Ctx, request: DeleteLessonRequest) => {
  return courseStore.deleteLesson(ctx, request.courseId, request.lessonId);
};
