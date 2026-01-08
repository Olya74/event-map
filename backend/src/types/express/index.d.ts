import type e from "express";
import type { IUserJwt } from "../../models/UserJwt";
import { MyJwtPayload } from "../../models/MyJwtPayload.ts";

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;
    }
  }
}
export {};