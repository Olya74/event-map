import { app } from "./app.js";
import "dotenv/config";
import "./config/db.js";
import "./models/index.js";

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
