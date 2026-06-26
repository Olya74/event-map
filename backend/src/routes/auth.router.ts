import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { registerValidator } from "../validators/auth/register.validator.js";
import {
  registration,
  login,
  activate,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { loginValidator } from "../validators/auth/login.validator.js";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
});

const authRouter = Router();
authRouter.post("/login", authLimiter, loginValidator, login);
authRouter.post("/register", authLimiter, registerValidator, registration);
authRouter.get("/activate/:link", activate);
authRouter.post("/logout", logout);
authRouter.get("/refresh", refresh);


export default authRouter;
