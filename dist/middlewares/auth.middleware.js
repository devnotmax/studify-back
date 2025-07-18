"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = require("../app/config/database/connection");
const user_model_1 = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({
                message: 'No token provided'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userRepository = connection_1.AppDataSource.getRepository(user_model_1.User);
        const user = await userRepository.findOne({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({
                message: 'User not found'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: 'Invalid token'
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
