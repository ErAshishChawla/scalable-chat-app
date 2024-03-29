import { Router } from "express";

import {
  checkAuth,
  handleSignin,
  handleSignup,
  handleVerifyEmail,
  handleSignout,
} from "../../controllers/auth";

const authRouter = Router();

authRouter.post("/signup", handleSignup);

authRouter.get("/verify-email", handleVerifyEmail);

authRouter.post("/signin", handleSignin);

authRouter.get("/check-auth", checkAuth);

authRouter.post("/signout", handleSignout);

export { authRouter };
