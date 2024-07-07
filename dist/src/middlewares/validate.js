"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddUserToOrganisation = exports.validateCreateOrganisation = exports.validateRegister = void 0;
const validateRegister = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const errors = [];
    if (!firstName) {
        errors.push({ field: "firstName", message: "First name is required" });
    }
    if (typeof firstName !== "string") {
        errors.push({ field: "firstName", message: "First name must be a string" });
    }
    if (!lastName) {
        errors.push({ field: "lastName", message: "Last name is required" });
    }
    if (typeof lastName !== "string") {
        errors.push({ field: "lastName", message: "Last name must be a string" });
    }
    if (!email) {
        errors.push({ field: "email", message: "Email is required" });
    }
    if (typeof email !== "string") {
        errors.push({ field: "email", message: "Email must be a string" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push({ field: "email", message: "Email format is invalid" });
    }
    if (!password) {
        errors.push({ field: "password", message: "Password is required" });
    }
    if (typeof password !== "string") {
        errors.push({ field: "password", message: "Password must be a string" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }
    next();
};
exports.validateRegister = validateRegister;
const validateCreateOrganisation = (req, res, next) => {
    const { name, description } = req.body;
    const errors = [];
    if (!name)
        errors.push({ field: "name", message: "Name is required" });
    if (typeof name !== "string")
        errors.push({ field: "name", message: "Name must be a string" });
    if (description && typeof description !== "string") {
        errors.push({
            field: "description",
            message: "Description must be a string",
        });
    }
    if (errors.length > 0) {
        return res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
    next();
};
exports.validateCreateOrganisation = validateCreateOrganisation;
const validateAddUserToOrganisation = (req, res, next) => {
    const { userId } = req.body;
    const errors = [];
    if (!userId) {
        errors.push({ field: "userId", message: "User ID is required" });
    }
    if (typeof userId !== "string") {
        errors.push({ field: "userId", message: "User ID must be a string" });
    }
    if (errors.length > 0) {
        return res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
            errors,
        });
    }
    next();
};
exports.validateAddUserToOrganisation = validateAddUserToOrganisation;
