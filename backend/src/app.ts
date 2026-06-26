import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import "dotenv/config";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import ErrorHandler from "./exeptions/errorHandlung.js";

const app: Application = express();
app.set("trust proxy", true);//for deploying behind a reverse proxy (like Nginx) to get the correct client IP address
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
}));




app.use("/api", router);
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ErrorHandler) {
      return res.status(err.status).json({
        message: err.message,
        error: err.errors,
      });
    }
 
    return res.status(500).json({ errors: err });
  }
);
export { app };
