import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configuration } from "./config/config.js";

const app = express();
// MIDDLEWARE USED

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `${configuration.BASE_URL}`,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ROUTES DEFINED

import { appRouter } from "./routes/user.routes.js";
import { ApiError } from "./utils/Apierror.js";

app.use("/api/v1/user", appRouter);
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    return res
      .status(err.statusCode)
      .json({ message: err.message, status: err.statusCode });
  }
});

export default app;
