"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const config_1 = __importDefault(require("config"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const db_1 = __importDefault(require("../prisma/db"));
const jwt_1 = require("../utils/jwt");
const auth_service_1 = require("../services/auth.service");
const clientError_1 = require("../exceptions/clientError");
const createSendToken = (user, statusCode, message, res) => {
    // Create an access token
    const accessToken = (0, jwt_1.signToken)(user, "accessTokenPrivateKey", {
        expiresIn: config_1.default.get("accessTokenTtl"),
    });
    res.status(statusCode).json({
        status: "success",
        message,
        data: {
            accessToken,
            user,
        },
    });
};
exports.register = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;
    // Check if user already exist
    const existingUser = await db_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(422).json({
            errors: [{ field: "email", message: "Email already exists" }],
        });
    }
    // Create a new user record
    const newUser = await (0, auth_service_1.createUser)({
        firstName,
        lastName,
        email,
        password,
        phone,
    });
    if (!newUser) {
        return next(new clientError_1.ClientError("Registration unsuccessful"));
    }
    createSendToken(newUser, 201, "Registration successful", res);
});
exports.login = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    // Check if email and password exists
    if (!email || !password) {
        return next(new clientError_1.ClientError("Please provide email and password!"));
    }
    const user = await (0, auth_service_1.loginUser)({ email, password });
    createSendToken(user, 200, "Login successful", res);
});
