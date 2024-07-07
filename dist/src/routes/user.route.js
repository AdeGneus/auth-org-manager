"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var deserializeUser_1 = __importDefault(require("../middlewares/deserializeUser"));
var user_controller_1 = require("../controllers/user.controller");
var router = (0, express_1.Router)();
// Protected routes
router.use(deserializeUser_1.default);
router.get("/:id", user_controller_1.getUser);
exports.default = router;
