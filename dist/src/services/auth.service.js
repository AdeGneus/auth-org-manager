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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
var argon2_1 = __importDefault(require("argon2"));
var uuid_1 = require("uuid");
var db_1 = __importDefault(require("../prisma/db"));
var checkPassword_1 = require("../utils/checkPassword");
var createUser = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var firstName, lastName, email, password, phone, hashedPassword, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstName = userData.firstName, lastName = userData.lastName, email = userData.email, password = userData.password, phone = userData.phone;
                return [4 /*yield*/, argon2_1.default.hash(password)];
            case 1:
                hashedPassword = _a.sent();
                return [4 /*yield*/, db_1.default.user.create({
                        data: {
                            userId: (0, uuid_1.v4)(),
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: hashedPassword,
                            phone: phone,
                            organisations: {
                                create: {
                                    orgId: (0, uuid_1.v4)(),
                                    name: "".concat(firstName, "'s Organisation"),
                                    description: "",
                                },
                            },
                        },
                        select: {
                            userId: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    })];
            case 2:
                newUser = _a.sent();
                return [2 /*return*/, newUser];
        }
    });
}); };
exports.createUser = createUser;
var loginUser = function (loginData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, user, _a, _, userWithoutPassword;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                email = loginData.email, password = loginData.password;
                return [4 /*yield*/, db_1.default.user.findUnique({
                        where: { email: email },
                        select: {
                            userId: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                            password: true,
                        },
                    })];
            case 1:
                user = _b.sent();
                _a = !user;
                if (_a) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, checkPassword_1.isCorrectPassword)(user.password, password)];
            case 2:
                _a = !(_b.sent());
                _b.label = 3;
            case 3:
                if (_a) {
                    throw new Error("Authentication failed");
                }
                _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                return [2 /*return*/, userWithoutPassword];
        }
    });
}); };
exports.loginUser = loginUser;
