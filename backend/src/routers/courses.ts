import express from "express";
import {
  createCourse,
  createCourseRequestSchema,
} from "../handlers/create-course";
import {
  createLesson,
  createLessonRequestSchema,
} from "../handlers/create-lesson";
import {
  deleteCourse,
  deleteCourseRequestSchema,
} from "../handlers/delete-course";
import {
  deleteLesson,
  deleteLessonRequestSchema,
} from "../handlers/delete-lesson";
import { getCourse, getCourseRequestSchema } from "../handlers/get-course";
import { getLesson, getLessonRequestSchema } from "../handlers/get-lesson";
import { listCourses } from "../handlers/list-courses";
import {
  listLessons,
  listLessonsRequestSchema,
} from "../handlers/list-lessons";
import {
  updateCourse,
  updateCourseRequestSchema,
} from "../handlers/update-course";
import {
  updateLesson,
  updateLessonRequestSchema,
} from "../handlers/update-lesson";
import { requiresAdminPriviliges } from "../middleware";

export const coursesRouter = () => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const result = await listCourses(req.ctx);
    res.status(200).send(result);
  });

  router.post("/", requiresAdminPriviliges(), async (req, res) => {
    const createCourseRequest = createCourseRequestSchema.parse(req.body);
    const result = await createCourse(req.ctx, createCourseRequest);
    res.status(201).send(result);
  });

  router.get("/:courseId", async (req, res) => {
    const getCourseRequest = getCourseRequestSchema.parse({
      courseId: req.params.courseId,
    });
    const result = await getCourse(req.ctx, getCourseRequest);
    res.status(200).send(result);
  });

  router.put("/:courseId", requiresAdminPriviliges(), async (req, res) => {
    const updateCouseRequst = updateCourseRequestSchema.parse({
      courseId: req.params.courseId,
      courseDetails: req.body,
    });
    const result = await updateCourse(req.ctx, updateCouseRequst);
    res.status(200).send(result);
  });

  router.delete("/:courseId", requiresAdminPriviliges(), async (req, res) => {
    const deleteCourseRequest = deleteCourseRequestSchema.parse({
      courseId: req.params.courseId,
    });
    const result = await deleteCourse(req.ctx, deleteCourseRequest);
    res.status(204).send();
  });

  router.get("/:courseId/lessons", async (req, res) => {
    const listLessonsRequest = listLessonsRequestSchema.parse({
      courseId: req.params.courseId,
    });
    const result = await listLessons(req.ctx, listLessonsRequest);
    res.status(200).send(result);
  });

  router.post(
    "/:courseId/lessons",
    requiresAdminPriviliges(),
    async (req, res) => {
      console.log("Creating lesson");
      const createLessonRequest = createLessonRequestSchema.parse({
        courseId: req.params.courseId,
        lessonDetails: req.body,
      });
      console.log(createLessonRequest);
      const result = await createLesson(req.ctx, createLessonRequest);
      res.status(200).send(result);
    }
  );

  router.get("/:courseId/lessons/:lessonId", async (req, res) => {
    const getLessonRequest = getLessonRequestSchema.parse({
      courseId: req.params.courseId,
      lessonId: req.params.lessonId,
    });
    const result = await getLesson(req.ctx, getLessonRequest);
    res.status(200).send(result);
  });

  router.put(
    "/:courseId/lessons/:lessonId",
    requiresAdminPriviliges(),
    async (req, res) => {
      const updateLessonRequest = updateLessonRequestSchema.parse({
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
        lessonDetails: req.body,
      });
      const result = await updateLesson(req.ctx, updateLessonRequest);
      res.status(200).send(result);
    }
  );

  router.delete(
    "/:courseId/lessons/:lessonId",
    requiresAdminPriviliges(),
    async (req, res) => {
      const deleteLessonRequest = deleteLessonRequestSchema.parse({
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
      });
      const result = await deleteLesson(req.ctx, deleteLessonRequest);
      res.status(204).send();
    }
  );

  return router;
};
