"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const organisation_route_1 = __importDefault(require("./organisation.route"));
const routes = (0, express_1.Router)();
routes.use("/auth", auth_route_1.default);
routes.use("/api/users", user_route_1.default);
routes.use("/api/organisations", organisation_route_1.default);
exports.default = routes;