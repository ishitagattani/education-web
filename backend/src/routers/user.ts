import express from "express";
import { getUserProfile, userProfileRequestSchema } from "../handlers/profile";

export const userRouter = () => {
  const router = express.Router();

  router.get("/me", async (req, res) => {
    const profileRequest = userProfileRequestSchema.parse({
      userId: req.ctx.user!.userId,
    });
    const result = await getUserProfile(profileRequest);
    res.status(200).send(result);
  });

  return router;
};
