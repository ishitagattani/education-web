import express from "express";
import {
  addEnrollment,
  addEnrollmentRequestSchema,
} from "../handlers/add-enrollment";
import {
  getEnrollmentsForUser,
  getEnrollmentsForUserRequestSchema,
} from "../handlers/get-enrollments-for-user";

export const enrollmentsRouter = () => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const getEnrollmentsForUserRequest =
      getEnrollmentsForUserRequestSchema.parse({
        userId: req.ctx.user!.userId,
      });

    const result = await getEnrollmentsForUser(getEnrollmentsForUserRequest);
    res.status(200).send(result);
  });

  router.post("/", async (req, res) => {
    const addEnrollmentRequest = addEnrollmentRequestSchema.parse(req.body);
    const result = await addEnrollment(req.ctx, addEnrollmentRequest);
    res.status(201).send();
  });

  return router;
};
