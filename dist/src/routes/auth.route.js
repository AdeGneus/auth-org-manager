"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var validate_1 = require("../middlewares/validate");
var router = (0, express_1.Router)();
router.post("/register", validate_1.validateRegister, auth_controller_1.register);
router.post("/login", validate_1.validateLogin, auth_controller_1.login);
exports.default = router;
