"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var config_1 = __importDefault(require("config"));
var app_1 = __importDefault(require("./src/app"));
var logger_1 = __importDefault(require("./src/utils/logger"));
var port = config_1.default.get("port");
app_1.default.listen(port, function () {
    logger_1.default.info("App is listening at http://localhost:".concat(port));
});
