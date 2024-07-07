"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToOrganisation = exports.createNewOrganisation = exports.findOrganisationById = exports.isUserInOrganisation = exports.findOganisationsByUserId = void 0;
const db_1 = __importDefault(require("../prisma/db"));
const findOganisationsByUserId = async (userId) => {
    const organisations = await db_1.default.organisation.findMany({
        where: {
            users: {
                some: { userId },
            },
        },
        select: {
            orgId: true,
            name: true,
            description: true,
        },
    });
    return organisations;
};
exports.findOganisationsByUserId = findOganisationsByUserId;
const isUserInOrganisation = async (userId, orgId) => {
    const organisation = await db_1.default.organisation.findFirst({
        where: {
            orgId,
            users: {
                some: { userId },
            },
        },
    });
    return organisation !== null;
};
exports.isUserInOrganisation = isUserInOrganisation;
const findOrganisationById = async (orgId) => {
    const organisation = await db_1.default.organisation.findUnique({
        where: { orgId },
        select: {
            orgId: true,
            name: true,
            description: true,
        },
    });
    return organisation;
};
exports.findOrganisationById = findOrganisationById;
const createNewOrganisation = async (name, description, userId) => {
    const newOrganisation = await db_1.default.organisation.create({
        data: {
            name,
            description,
            users: {
                connect: { userId },
            },
        },
        select: {
            orgId: true,
            name: true,
            description: true,
        },
    });
    return newOrganisation;
};
exports.createNewOrganisation = createNewOrganisation;
const addUserToOrganisation = async (orgId, userId) => {
    const organisation = await db_1.default.organisation.update({
        where: { orgId },
        data: {
            users: {
                connect: { userId },
            },
        },
    });
    return organisation;
};
exports.addUserToOrganisation = addUserToOrganisation;
