import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";
import { lessonDetailsSchema } from "../models";

export const createLessonRequestSchema = z.object({
  courseId: z.string(),
  lessonDetails: lessonDetailsSchema,
});

export type CreateLessonRequest = z.infer<typeof createLessonRequestSchema>;

export const createLesson = async (ctx: Ctx, request: CreateLessonRequest) => {
  const lessonId = uuidv7();
  return courseStore.createLesson(
    ctx,
    request.courseId,
    lessonId,
    request.lessonDetails
  );
};
