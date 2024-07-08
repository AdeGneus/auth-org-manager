import { NextFunction, Request, Response } from "express";
import config from "config";
import { AppError } from "../exceptions/appError";
import log from "../utils/logger";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { JsonWebTokenError } from "jsonwebtoken";
import { ResponseError } from "../interfaces/responseError";
import { ClientError } from "../exceptions/clientError";

const handleFailedAuth = (err: any) => {
  const message = err.message;

  return new UnauthorizedError(message);
};

const handleJWTError = () => {
  return new AppError("Authentication failed", 401);
};

export const sendErrorDev = (err: any, req: Request, res: Response) => {
  if (
    req.originalUrl.startsWith("/auth") ||
    req.originalUrl.startsWith("/api")
  ) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

export const sendErrorProd = (err: any, req: Request, res: Response) => {
  if (
    req.originalUrl.startsWith("/auth") ||
    req.originalUrl.startsWith("/api")
  ) {
    // 1)  Operational, trusted error: send message to client
    if (err.isOperational) {
      const appError = err as AppError;

      let response = {
        status: appError.status,
        message: appError.message,
        statusCode: appError.statusCode,
      } as ResponseError;

      return res.status(appError.statusCode).json(response);
    }
    // 2) Programming or other unknown error: don't leak error details
    log.error(`💥: ${err}`);

    // Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
      statusCode: 500,
    });
  }
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? "error";

  const env = config.get<string>("NODE_ENV");

  if (env === "development") {
    sendErrorDev(err, req, res);
  } else if (env === "production") {
    if (err.message === "Authentication failed") {
      err = handleFailedAuth(err);
    }

    if (err instanceof JsonWebTokenError) {
      err = handleJWTError();
    }

    if (err instanceof TypeError) {
      err.message = "Authentication failed";
      err = handleFailedAuth(err);
    }
    sendErrorProd(err, req, res);
  }
};

export default errorHandler;
