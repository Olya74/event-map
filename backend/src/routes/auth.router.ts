import { Router } from "express";
import { registerValidator } from "../validators/auth/register.validator.js";
import {
  registration,
  login,
  activate,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginValidator } from "../validators/auth/login.validator.js";

const authRouter = Router();
authRouter.post("/login", loginValidator, login);
authRouter.post("/register",registerValidator, registration);
authRouter.get("/activate/:link", activate);
authRouter.post("/logout", logout);
authRouter.get("/refresh", refresh);


export default authRouter;
