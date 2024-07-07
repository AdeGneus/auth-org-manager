"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserInOrganisations = exports.findUserById = void 0;
const db_1 = __importDefault(require("../prisma/db"));
const findUserById = async (id) => {
    const user = await db_1.default.user.findUnique({
        where: { userId: id },
        select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
        },
    });
    return user;
};
exports.findUserById = findUserById;
const findUserInOrganisations = async (userId, orgUserId) => {
    const organisations = await db_1.default.organisation.findMany({
        where: {
            users: {
                some: { userId },
            },
        },
        select: {
            users: {
                where: { userId: orgUserId },
                select: {
                    userId: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                },
            },
        },
    });
    return organisations.flatMap((org) => org.users);
};
exports.findUserInOrganisations = findUserInOrganisations;
