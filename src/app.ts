import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";

import appErrorHandler from "./middlewares/errorHandler";
import { NotFoundError } from "./exceptions/notFoundError";

const app = express();

app.set("trust proxy", 1);

// Reduce fingerprinting
app.disable("x-powered-by");

// Development logging
if (config.get<string>("NODE_ENV") === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json({ limit: "10kb" }));

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(appErrorHandler);

export default app;
