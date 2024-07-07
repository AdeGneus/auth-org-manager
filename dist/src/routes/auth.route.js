"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
router.post("/register", validate_1.validateRegister, auth_controller_1.register);
router.post("/login", auth_controller_1.login);
exports.default = router;
