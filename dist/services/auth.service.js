"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const connection_1 = require("../app/config/database/connection");
const user_model_1 = require("../models/user.model");
const password_utils_1 = require("../utils/password.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
class AuthService {
    static async register(userData) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await (0, password_utils_1.hashPassword)(userData.password);
        const user = this.userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        await this.userRepository.save(user);
        const token = (0, jwt_utils_1.generateToken)(user.id);
        return { user, token };
    }
    static async login(email, password) {
        const user = await this.userRepository.findOne({
            where: { email }
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await (0, password_utils_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        const token = (0, jwt_utils_1.generateToken)(user.id);
        return { user, token };
    }
}
exports.AuthService = AuthService;
AuthService.userRepository = connection_1.AppDataSource.getRepository(user_model_1.User);
