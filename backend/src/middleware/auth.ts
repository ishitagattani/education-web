import { NextFunction, Request, Response } from "express";

export const requiresAuth =
  () => (req: Request, res: Response, next: NextFunction) => {
    if (req.ctx.user) {
      next();
    } else {
      throw new Error("Unauthorized");
    }
  };

export const requiresAdminPriviliges =
  () => (req: Request, res: Response, next: NextFunction) => {
    if (req.ctx.user && req.ctx.user.role === "admin") {
      next();
    } else {
      throw new Error("Unauthorized");
    }
  };
