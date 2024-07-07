"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Async handler to wrap the API routes, this allows for async error handling.
 * @param fn Function to call for the API endpoint
 * @returns Promise with a catch statement
 */
var asyncHandler = function (fn) {
    return function (req, res, next) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
