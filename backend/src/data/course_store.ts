import {
  Course,
  CourseDetails,
  Lesson,
  LessonDetails,
  LessonPreview,
  courseSchema,
  lessonContentSchema,
  lessonSchema,
} from "../models";
import { db } from "./db";
import { Ctx } from "../common/ctx";

export async function createCourse(
  _ctx: Ctx,
  courseDetails: CourseDetails,
  courseId: string
): Promise<Course> {
  try {
    await db
      .insertInto("course")
      .values({
        course_id: courseId,
        title: courseDetails.title,
        description: courseDetails.description,
        syllabus: courseDetails.syllabus,
        instructor_name: courseDetails.instructorName,
      })
      .execute();
    return courseSchema.parse({
      courseId,
      details: courseDetails,
      lessonCount: 0,
    });
  } catch (error: any) {
    console.error("[PostgresCourseStore.createCourse]", error);
    throw new Error("Unexpected error");
  }
}

export async function getCourse(_ctx: Ctx, courseId: string): Promise<Course> {
  try {
    const course = await db
      .selectFrom("course")
      .leftJoin("lesson", "course.course_id", "lesson.course_id")
      .select(({ fn, ref }) => [
        "course.course_id",
        "course.title",
        "course.description",
        "course.syllabus",
        "course.instructor_name",
        fn.count(ref("lesson.lesson_id")).as("lesson_count"),
      ])
      .where("course.course_id", "=", courseId)
      .groupBy("course.course_id")
      .executeTakeFirst();
    if (!course) {
      throw new Error("Course not found");
    }
    return courseSchema.parse({
      courseId: course.course_id,
      details: {
        title: course.title,
        description: course.description,
        syllabus: course.syllabus,
        instructorName: course.instructor_name,
      },
      lessonCount: course.lesson_count,
    });
  } catch (error: any) {
    console.error("[PostgresCourseStore.getCourse]", error);
    throw new Error("Unexpected error");
  }
}

export async function listCourses(_ctx: Ctx): Promise<Course[]> {
  try {
    const courses = await db
      .selectFrom("course")
      .leftJoin("lesson", "course.course_id", "lesson.course_id")
      .select(({ fn, ref }) => [
        "course.course_id",
        "course.title",
        "course.description",
        "course.syllabus",
        "course.instructor_name",
        fn.count(ref("lesson.lesson_id")).as("lesson_count"),
      ])
      .groupBy("course.course_id")
      .execute();
    return courses.map((course) =>
      courseSchema.parse({
        courseId: course.course_id,
        details: {
          title: course.title,
          description: course.description,
          syllabus: course.syllabus,
          instructorName: course.instructor_name,
        },
        lessonCount: course.lesson_count,
      })
    );
  } catch (error: any) {
    console.error("[PostgresCourseStore.listCourses]", error);
    throw new Error("Unexpected error");
  }
}

export async function updateCourse(
  _ctx: Ctx,
  courseId: string,
  courseDetails: CourseDetails
): Promise<Course> {
  try {
    const updateResult = await db
      .updateTable("course")
      .set({
        title: courseDetails.title,
        description: courseDetails.description,
        syllabus: courseDetails.syllabus,
        instructor_name: courseDetails.instructorName,
      })
      .where("course_id", "=", courseId)
      .executeTakeFirst();
    if (!updateResult.numUpdatedRows) {
      throw new Error("Course not found");
    }
    return getCourse(_ctx, courseId);
  } catch (error: any) {
    console.error("[PostgresCourseStore.updateCourse]", error);
    throw new Error("Unexpected error");
  }
}

export async function deleteCourse(_ctx: Ctx, courseId: string): Promise<void> {
  try {
    const deleteResult = await db
      .deleteFrom("course")
      .where("course_id", "=", courseId)
      .executeTakeFirst();
    if (!deleteResult.numDeletedRows) {
      throw new Error("Course not found");
    }
  } catch (error: any) {
    console.error("[PostgresCourseStore.deleteCourse]", error);
    throw new Error("Unexpected error");
  }
}

export async function createLesson(
  _ctx: Ctx,
  courseId: string,
  lessonId: string,
  lessonDetails: LessonDetails
): Promise<Lesson> {
  try {
    const row = await db
      .insertInto("lesson")
      .values({
        lesson_id: lessonId,
        course_id: courseId,
        title: lessonDetails.title,
        content: lessonDetails.content,
      })
      .returning(["created_at"])
      .executeTakeFirst();
    if (!row) {
      throw new Error("Failed to create lesson");
    }
    return lessonSchema.parse({
      lessonId,
      details: lessonDetails,
      createdAt: row.created_at,
    });
  } catch (error: any) {
    console.error("[PostgresCourseStore.createLesson]", error);
    throw new Error("Unexpected error");
  }
}

export async function getLesson(
  _ctx: Ctx,
  courseId: string,
  lessonId: string
): Promise<Lesson> {
  try {
    const lesson = await db
      .selectFrom("lesson")
      .select(["title", "content", "created_at"])
      .where("course_id", "=", courseId)
      .where("lesson_id", "=", lessonId)
      .executeTakeFirst();
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    return lessonSchema.parse({
      lessonId,
      details: {
        title: lesson.title,
        content: lesson.content,
      },
      createdAt: lesson.created_at,
    });
  } catch (error: any) {
    console.error("[PostgresCourseStore.getLesson]", error);
    throw new Error("Unexpected error");
  }
}

export async function listLessons(
  _ctx: Ctx,
  courseId: string
): Promise<LessonPreview[]> {
  try {
    const lessons = await db
      .selectFrom("lesson")
      .select(["lesson_id", "title", "content", "created_at"])
      .where("course_id", "=", courseId)
      .execute();
    return lessons.map(
      (lesson) =>
        ({
          lessonId: lesson.lesson_id,
          title: lesson.title,
          type: lessonContentSchema.parse(lesson.content).type,
          createdAt: lesson.created_at,
        }) as LessonPreview
    );
  } catch (error: any) {
    console.error("[PostgresCourseStore.listLessons]", error);
    throw new Error("Unexpected error");
  }
}

export async function updateLesson(
  _ctx: Ctx,
  courseId: string,
  lessonId: string,
  lessonDetails: LessonDetails
): Promise<Lesson> {
  try {
    const updateResult = await db
      .updateTable("lesson")
      .set({
        title: lessonDetails.title,
        content: lessonDetails.content,
      })
      .where("course_id", "=", courseId)
      .where("lesson_id", "=", lessonId)
      .executeTakeFirst();

    if (!updateResult.numUpdatedRows) {
      throw new Error("Lesson not found");
    }
    return lessonSchema.parse({
      lessonId,
      details: lessonDetails,
    });
  } catch (error: any) {
    console.error("[PostgresCourseStore.updateLesson]", error);
    throw new Error("Unexpected error");
  }
}

export async function deleteLesson(
  _ctx: Ctx,
  courseId: string,
  lessonId: string
): Promise<void> {
  try {
    const deleteResult = await db
      .deleteFrom("lesson")
      .where("course_id", "=", courseId)
      .where("lesson_id", "=", lessonId)
      .executeTakeFirst();

    if (!deleteResult.numDeletedRows) {
      throw new Error("Lesson not found");
    }
  } catch (error: any) {
    console.error("[PostgresCourseStore.deleteLesson]", error);
    throw new Error("Unexpected error");
  }
}
