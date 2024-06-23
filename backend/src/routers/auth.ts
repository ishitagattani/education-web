import express, { CookieOptions } from "express";
import { ACCESS_TOKEN_COOKIE_KEY } from "../common/constants";
import { loginUser, loginUserRequestSchema } from "../handlers/login";
import { registerUser, registerUserRequestSchema } from "../handlers/register";

export const authRouter = () => {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const registrationRequest = registerUserRequestSchema.parse(req.body);
    await registerUser(registrationRequest);
    res.status(201).send();
  });

  router.post("/login", async (req, res) => {
    const loginRequest = loginUserRequestSchema.parse(req.body);
    const result = await loginUser(loginRequest);
    res
      .cookie(ACCESS_TOKEN_COOKIE_KEY, result.accessToken.token, {
        ...cookieConfig(),
        expires: result.accessToken.expirationDate,
      })
      .status(200)
      .send();
  });

  router.post("/logout", async (_, res) => {
    res.clearCookie(ACCESS_TOKEN_COOKIE_KEY);
    res.status(200).send();
  });

  return router;
};

const cookieConfig = (): Partial<CookieOptions> => {
  if (process.env.NODE_ENV === "production") {
    return {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
    };
  } else {
    return {
      httpOnly: true,
      path: "/",
      domain: "localhost",
      secure: false,
      sameSite: "lax",
    };
  }
};
