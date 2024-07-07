"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.createOrganisation = exports.getOrganisation = exports.getOrganisations = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const notFoundError_1 = require("../exceptions/notFoundError");
const organisation_service_1 = require("../services/organisation.service");
const unauthorizedError_1 = require("../exceptions/unauthorizedError");
exports.getOrganisations = (0, asyncHandler_1.default)(async (req, res, next) => {
    // Check if the user is accessing their own data or has permission to access
    const currentUser = req.user;
    const organisations = await (0, organisation_service_1.findOganisationsByUserId)(currentUser?.userId);
    if (!organisations || organisations.length === 0) {
        return next(new notFoundError_1.NotFoundError("No organisations found for this user"));
    }
    return res.status(200).json({
        status: "success",
        message: "Organisations fetched successfully",
        data: {
            organisations,
        },
    });
});
exports.getOrganisation = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { orgId } = req.params;
    const currentUser = req.user;
    // Check if user belongs to the organization
    const hasAccess = await (0, organisation_service_1.isUserInOrganisation)(currentUser?.userId, orgId);
    if (!hasAccess) {
        return next(new unauthorizedError_1.UnauthorizedError("You do not have permission to access this organization"));
    }
    const organisation = await (0, organisation_service_1.findOrganisationById)(orgId);
    if (!organisation) {
        return next(new notFoundError_1.NotFoundError("organisation not found"));
    }
    return res.status(200).json({
        status: "success",
        message: "Organization fetched successfully",
        data: {
            organisation,
        },
    });
});
exports.createOrganisation = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { name, description } = req.body;
    const currentUser = req.user;
    const newOrganisation = await (0, organisation_service_1.createNewOrganisation)(name, description, currentUser?.userId);
    return res.status(201).json({
        status: "success",
        message: "Organisation created successfully",
        data: newOrganisation,
    });
});
exports.addUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    const currentUser = req.user;
    // Check if current user belongs to the organization
    const hasAccess = await (0, organisation_service_1.isUserInOrganisation)(currentUser?.userId, orgId);
    if (!hasAccess) {
        return next(new unauthorizedError_1.UnauthorizedError("You do not have permission to access this organization"));
    }
    await (0, organisation_service_1.addUserToOrganisation)(orgId, userId);
    return res.status(200).json({
        status: "success",
        message: "User added to organisation successfully",
    });
});
