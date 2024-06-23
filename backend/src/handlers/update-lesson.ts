import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";
import { lessonDetailsSchema } from "../models";

export const updateLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
  lessonDetails: lessonDetailsSchema,
});

export type UpdateLessonRequest = z.infer<typeof updateLessonRequestSchema>;

export const updateLesson = async (ctx: Ctx, request: UpdateLessonRequest) => {
  return courseStore.updateLesson(
    ctx,
    request.courseId,
    request.lessonId,
    request.lessonDetails
  );
};
