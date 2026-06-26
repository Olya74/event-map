import { MyJwtPayload } from "../../models/MyJwtPayload";

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;
    }
  }
}
export {};