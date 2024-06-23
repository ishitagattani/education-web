import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ACCESS_TOKEN_COOKIE_KEY } from "../common/constants";
import { ctxSchema } from "../common/ctx";
import { verifyToken } from "../common/jwt";

export const contextResolver =
  () => (req: Request, _res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_KEY] || "";

    try {
      const { userId, email, role } = verifyToken(accessToken);

      req.ctx = ctxSchema.parse({
        requestId: uuidv4(),
        user: {
          userId,
          email,
          role,
        },
      });
    } catch (e: unknown) {
      req.ctx = ctxSchema.parse({
        requestId: uuidv4(),
      });
    }

    next();
  };
