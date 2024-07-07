"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const argon2_1 = __importDefault(require("argon2"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../prisma/db"));
const checkPassword_1 = require("../utils/checkPassword");
const createUser = async (userData) => {
    const { firstName, lastName, email, password, phone } = userData;
    // Hash the password before storing it in the database
    const hashedPassword = await argon2_1.default.hash(password);
    const newUser = await db_1.default.user.create({
        data: {
            userId: (0, uuid_1.v4)(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            organisations: {
                create: {
                    orgId: (0, uuid_1.v4)(),
                    name: `${firstName}'s Organisation`,
                    description: "",
                },
            },
        },
        select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
        },
    });
    return newUser;
};
exports.createUser = createUser;
const loginUser = async (loginData) => {
    const { email, password } = loginData;
    // Check if user exists and password is correct
    const user = await db_1.default.user.findUnique({
        where: { email },
        select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            password: true,
        },
    });
    if (!user || !(await (0, checkPassword_1.isCorrectPassword)(user.password, password))) {
        throw new Error("Authentication failed");
    }
    // Exclude password from user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.loginUser = loginUser;
