import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import ErrorHandler from "./exeptions/errorHandlung.js";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

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
