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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, token } = yield auth_service_1.AuthService.register(req.body);
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
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, token } = yield auth_service_1.AuthService.login(email, password);
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
        });
    }
}
exports.AuthController = AuthController;
