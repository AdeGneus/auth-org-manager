"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.createOrganisation = exports.getOrganisation = exports.getOrganisations = void 0;
var asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
var notFoundError_1 = require("../exceptions/notFoundError");
var organisation_service_1 = require("../services/organisation.service");
var unauthorizedError_1 = require("../exceptions/unauthorizedError");
exports.getOrganisations = (0, asyncHandler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, organisations;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentUser = req.user;
                return [4 /*yield*/, (0, organisation_service_1.findOganisationsByUserId)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId)];
            case 1:
                organisations = _a.sent();
                if (!organisations || organisations.length === 0) {
                    return [2 /*return*/, next(new notFoundError_1.NotFoundError("No organisations found for this user"))];
                }
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "Organisations fetched successfully",
                        data: {
                            organisations: organisations,
                        },
                    })];
        }
    });
}); });
exports.getOrganisation = (0, asyncHandler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orgId, currentUser, hasAccess, organisation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgId = req.params.orgId;
                currentUser = req.user;
                return [4 /*yield*/, (0, organisation_service_1.isUserInOrganisation)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId, orgId)];
            case 1:
                hasAccess = _a.sent();
                if (!hasAccess) {
                    return [2 /*return*/, next(new unauthorizedError_1.UnauthorizedError("You do not have permission to access this organization"))];
                }
                return [4 /*yield*/, (0, organisation_service_1.findOrganisationById)(orgId)];
            case 2:
                organisation = _a.sent();
                if (!organisation) {
                    return [2 /*return*/, next(new notFoundError_1.NotFoundError("organisation not found"))];
                }
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "Organization fetched successfully",
                        data: {
                            organisation: organisation,
                        },
                    })];
        }
    });
}); });
exports.createOrganisation = (0, asyncHandler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, currentUser, newOrganisation;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, description = _a.description;
                currentUser = req.user;
                return [4 /*yield*/, (0, organisation_service_1.createNewOrganisation)(name, description, currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId)];
            case 1:
                newOrganisation = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        status: "success",
                        message: "Organisation created successfully",
                        data: newOrganisation,
                    })];
        }
    });
}); });
exports.addUser = (0, asyncHandler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orgId, userId, currentUser, hasAccess;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgId = req.params.orgId;
                userId = req.body.userId;
                currentUser = req.user;
                return [4 /*yield*/, (0, organisation_service_1.isUserInOrganisation)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId, orgId)];
            case 1:
                hasAccess = _a.sent();
                if (!hasAccess) {
                    return [2 /*return*/, next(new unauthorizedError_1.UnauthorizedError("You do not have permission to access this organization"))];
                }
                return [4 /*yield*/, (0, organisation_service_1.addUserToOrganisation)(orgId, userId)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "User added to organisation successfully",
                    })];
        }
    });
}); });
