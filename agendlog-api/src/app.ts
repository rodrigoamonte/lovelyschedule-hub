import express from "express";
import cors from "cors";
import { env } from "./core/config/env.js";
import routes from "./routes.js";

const app = express();
const API_BASE_PATH = `/api/${env.API_VERSION}`;

app.use(cors());
app.use(express.json());

app.use(API_BASE_PATH, routes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  },
);

app.listen(env.PORT, () => {
  console.log(`Server running (PORT: ${env.PORT}, PATH ${API_BASE_PATH})`);
});
