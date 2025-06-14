"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
const hello = (req, res, next) => {
    res.status(200).json("hello server");
};
exports.hello = hello;
