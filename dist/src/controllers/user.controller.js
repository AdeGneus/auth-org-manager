"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const notFoundError_1 = require("../exceptions/notFoundError");
const unauthorizedError_1 = require("../exceptions/unauthorizedError");
const user_service_1 = require("../services/user.service");
exports.getUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    // Check if the user is accessing their own data or has permission to access
    const currentUser = req.user;
    if (currentUser?.userId !== id) {
        return next(new unauthorizedError_1.UnauthorizedError("You do not have permission to access this data"));
    }
    let user;
    if (currentUser?.userId === id) {
        user = await (0, user_service_1.findUserById)(id);
    }
    else {
        const usersInOrgs = await (0, user_service_1.findUserInOrganisations)(currentUser.userId, id);
        user = usersInOrgs.find((user) => user.userId === id);
    }
    if (!user) {
        return next(new notFoundError_1.NotFoundError("user not found"));
    }
    return res.status(200).json({
        status: "success",
        message: "User fetched successfully",
        data: {
            user,
        },
    });
});
