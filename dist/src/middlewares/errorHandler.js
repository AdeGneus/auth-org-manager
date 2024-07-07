"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorProd = exports.sendErrorDev = void 0;
var config_1 = __importDefault(require("config"));
var appError_1 = require("../exceptions/appError");
var logger_1 = __importDefault(require("../utils/logger"));
var unauthorizedError_1 = require("../exceptions/unauthorizedError");
var jsonwebtoken_1 = require("jsonwebtoken");
var clientError_1 = require("../exceptions/clientError");
var handleFailedAuth = function (err) {
    var message = err.message;
    return new unauthorizedError_1.UnauthorizedError(message);
};
var handleJWTError = function () {
    return new appError_1.AppError("Authentication failed", 401);
};
var handlePrismaError = function () {
    return new clientError_1.ClientError("Client Error");
};
var sendErrorDev = function (err, req, res) {
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
var sendErrorProd = function (err, req, res) {
    if (req.originalUrl.startsWith("/auth") ||
        req.originalUrl.startsWith("/api")) {
        // 1)  Operational, trusted error: send message to client
        if (err instanceof appError_1.AppError && err.isOperational) {
            var appError = err;
            var response = {
                status: appError.status,
                message: appError.message,
                statusCode: appError.statusCode,
            };
            return res.status(appError.statusCode).json(response);
        }
        // 2) Programming or other unknown error: don't leak error details
        logger_1.default.error("\uD83D\uDCA5: ".concat(err));
        // Send generic message
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!",
            statusCode: 500,
        });
    }
};
exports.sendErrorProd = sendErrorProd;
var errorHandler = function (err, req, res, next) {
    var _a, _b;
    err.statusCode = (_a = err.statusCode) !== null && _a !== void 0 ? _a : 500;
    err.status = (_b = err.status) !== null && _b !== void 0 ? _b : "error";
    var env = config_1.default.get("NODE_ENV");
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
