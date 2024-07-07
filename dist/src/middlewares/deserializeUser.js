"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("./asyncHandler"));
const unauthorizedError_1 = require("../exceptions/unauthorizedError");
const jwt_1 = require("../utils/jwt");
const db_1 = __importDefault(require("../prisma/db"));
const deserializeUser = (0, asyncHandler_1.default)(async (req, _res, next) => {
    // 1) Get token and check if it exists
    let accessToken = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
        accessToken = req.headers.authorization.split(" ")[1];
    }
    if (!accessToken) {
        return next(new unauthorizedError_1.UnauthorizedError("You are not logged in! Please log in to get access"));
    }
    // 2) Verify token
    const decoded = (0, jwt_1.verifyToken)(accessToken, "accessTokenPublicKey");
    const userId = decoded?.userId;
    // 3) Check if user still exists
    if (decoded) {
        const currentUser = await db_1.default.user.findUnique({
            where: { userId },
        });
        if (!currentUser) {
            return next(new unauthorizedError_1.UnauthorizedError("The user belonging to this token does no longer exist"));
        }
        // Grant access to protected route
        req.user = currentUser;
        return next();
    }
    return next();
});
exports.default = deserializeUser;
