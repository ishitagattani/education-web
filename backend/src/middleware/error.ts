import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("[errorMiddleware]", err);
  if (err instanceof ZodError) {
    res.status(400).json({
      message: err.errors,
    });
  } else if (err instanceof Error) {
    res.status(400).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
