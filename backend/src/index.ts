import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import { contextResolver, errorMiddleware, requiresAuth } from "./middleware";
import {
  authRouter,
  coursesRouter,
  enrollmentsRouter,
  userRouter,
} from "./routers";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(contextResolver());

app.get("/health", (_, res) => {
  res.status(200).send();
});

app.use("/api/auth", authRouter());

app.use(requiresAuth());

app.use("/api/users", userRouter());
app.use("/api/courses", coursesRouter());
app.use("/api/enrollments", enrollmentsRouter());

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
