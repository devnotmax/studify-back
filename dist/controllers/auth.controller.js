"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res) {
        try {
            const { user, token } = await auth_service_1.AuthService.register(req.body);
            res.status(201).json({
                message: 'User registered successfully',
                user,
                token
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await auth_service_1.AuthService.login(email, password);
            res.json({
                message: 'Login successful',
                user,
                token
            });
        }
        catch (error) {
            res.status(401).json({
                message: error.message
            });
        }
    }
}
exports.AuthController = AuthController;
