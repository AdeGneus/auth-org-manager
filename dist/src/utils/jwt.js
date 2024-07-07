"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = __importDefault(require("config"));
var signToken = function (object, keyName, options) {
    var signingKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
    return (0, jsonwebtoken_1.sign)(object, signingKey, __assign(__assign({}, (options && options)), { algorithm: "RS256" }));
};
exports.signToken = signToken;
var verifyToken = function (token, keyName) {
    var publicKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
    var decoded = (0, jsonwebtoken_1.verify)(token, publicKey);
    return decoded;
};
exports.verifyToken = verifyToken;
