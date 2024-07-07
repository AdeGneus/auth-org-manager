"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorProd = exports.sendErrorDev = void 0;
const config_1 = __importDefault(require("config"));
const appError_1 = require("../exceptions/appError");
const logger_1 = __importDefault(require("../utils/logger"));
const unauthorizedError_1 = require("../exceptions/unauthorizedError");
const jsonwebtoken_1 = require("jsonwebtoken");
const clientError_1 = require("../exceptions/clientError");
const handleFailedAuth = (err) => {
    const message = err.message;
    return new unauthorizedError_1.UnauthorizedError(message);
};
const handleJWTError = () => {
    return new appError_1.AppError("Authentication failed", 401);
};
const handlePrismaError = () => {
    return new clientError_1.ClientError("Client Error");
};
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/auth") ||
        req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};
exports.sendErrorDev = sendErrorDev;
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/auth") ||
        req.originalUrl.startsWith("/api")) {
        // 1)  Operational, trusted error: send message to client
        if (err instanceof appError_1.AppError && err.isOperational) {
            const appError = err;
            let response = {
                status: appError.status,
                message: appError.message,
                statusCode: appError.statusCode,
            };
            return res.status(appError.statusCode).json(response);
        }
        // 2) Programming or other unknown error: don't leak error details
        logger_1.default.error(`💥: ${err}`);
        // Send generic message
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!",
            statusCode: 500,
        });
    }
};
exports.sendErrorProd = sendErrorProd;
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode ?? 500;
    err.status = err.status ?? "error";
    const env = config_1.default.get("NODE_ENV");
    if (env === "development") {
        (0, exports.sendErrorDev)(err, req, res);
    }
    else if (env === "production") {
        if (err.message === "Authentication failed") {
            err = handleFailedAuth(err);
        }
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            err = handleJWTError();
        }
        if (err instanceof TypeError) {
            err.message = "Authentication failed";
            err = handleFailedAuth(err);
        }
        (0, exports.sendErrorProd)(err, req, res);
    }
};
exports.default = errorHandler;
