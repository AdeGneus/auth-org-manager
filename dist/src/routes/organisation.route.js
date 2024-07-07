"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var deserializeUser_1 = __importDefault(require("../middlewares/deserializeUser"));
var organisation_controller_1 = require("../controllers/organisation.controller");
var validate_1 = require("../middlewares/validate");
var router = (0, express_1.Router)();
// Protected routes
router.use(deserializeUser_1.default);
router.get("/", organisation_controller_1.getOrganisations);
router.get("/:orgId", organisation_controller_1.getOrganisation);
router.post("/", validate_1.validateCreateOrganisation, organisation_controller_1.createOrganisation);
router.post("/:orgId/users", validate_1.validateAddUserToOrganisation, organisation_controller_1.addUser);
exports.default = router;
