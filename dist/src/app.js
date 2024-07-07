"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("config"));
var morgan_1 = __importDefault(require("morgan"));
var errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
var index_route_1 = __importDefault(require("./routes/index.route"));
var notFoundError_1 = require("./exceptions/notFoundError");
var app = (0, express_1.default)();
app.set("trust proxy", 1);
// Reduce fingerprinting
app.disable("x-powered-by");
// Development logging
if (config_1.default.get("NODE_ENV") === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Body parser
app.use(express_1.default.json({ limit: "10kb" }));
// Routes
app.use("/", index_route_1.default);
app.use("*", function (req, res, next) {
    next(new notFoundError_1.NotFoundError("Can't find ".concat(req.originalUrl, " on this server!")));
});
// Global error handler
app.use(errorHandler_1.default);
exports.default = app;
