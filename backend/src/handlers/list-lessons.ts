import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";

export const listLessonsRequestSchema = z.object({
  courseId: z.string(),
});

export type ListLessonsRequest = z.infer<typeof listLessonsRequestSchema>;

export const listLessons = async (ctx: Ctx, request: ListLessonsRequest) => {
  return courseStore.listLessons(ctx, request.courseId);
};
