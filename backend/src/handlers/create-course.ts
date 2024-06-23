import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";
import { courseDetailsSchema } from "../models";

export const createCourseRequestSchema = courseDetailsSchema;

export type CreateCourseRequest = z.infer<typeof createCourseRequestSchema>;

export const createCourse = async (ctx: Ctx, request: CreateCourseRequest) => {
  const courseId = uuidv7();
  return courseStore.createCourse(ctx, request, courseId);
};
