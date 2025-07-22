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
        console.log('[AUTH] Petición recibida:', req.method, req.originalUrl);
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            console.log('[AUTH] No token provided');
            res.status(401).json({
                message: 'No token provided'
            });
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        }
        catch (jwtError) {
            console.log('[AUTH] Token inválido:', jwtError);
            res.status(401).json({
                message: 'Invalid token'
            });
            return;
        }
        const userRepository = connection_1.AppDataSource.getRepository(user_model_1.User);
        const user = await userRepository.findOne({ where: { id: decoded.userId } });
        if (!user) {
            console.log('[AUTH] Usuario no encontrado para userId:', decoded.userId);
            res.status(401).json({
                message: 'User not found'
            });
            return;
        }
        req.user = user;
        console.log('[AUTH] Autenticación exitosa para userId:', user.id);
        next();
    }
    catch (error) {
        console.log('[AUTH] Error inesperado:', error);
        res.status(401).json({
            message: 'Invalid token'
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
