import { Enrollment, enrollmentSchema } from "../models";
import { db } from "./db";

export async function getEnrollmentsForUser(
  userId: string
): Promise<Enrollment[]> {
  try {
    const rows = await db
      .selectFrom("enrollments")
      .select(["course_id"])
      .where("user_id", "=", userId)
      .execute();

    return rows.map((row) =>
      enrollmentSchema.parse({ courseId: row.course_id, userId })
    );
  } catch (error: any) {
    console.error("[PostgresEnrollmentStore.getEnrollmentsForUser]", error);
    throw new Error("Unexpected error");
  }
}

export async function addEnrollment(enrollment: Enrollment): Promise<void> {
  try {
    await db
      .insertInto("enrollments")
      .values({
        user_id: enrollment.userId,
        course_id: enrollment.courseId,
      })
      .execute();
  } catch (error: any) {
    console.error("[PostgresEnrollmentStore.addEnrollment]", error);
    throw new Error("Unexpected error");
  }
}
