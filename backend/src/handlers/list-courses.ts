import { Ctx } from "../common/ctx";
import * as courseStore from "../data/course_store";

export const listCourses = async (ctx: Ctx) => {
  return courseStore.listCourses(ctx);
};
