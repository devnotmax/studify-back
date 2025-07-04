"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const connection_1 = require("../app/config/database/connection");
const user_model_1 = require("../models/user.model");
const password_utils_1 = require("../utils/password.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
class AuthService {
    static getUserRepository() {
        if (!connection_1.AppDataSource.isInitialized) {
            throw new Error('Database connection not initialized');
        }
        return connection_1.AppDataSource.getRepository(user_model_1.User);
    }
    static async register(userData) {
        try {
            const userRepository = this.getUserRepository();
            const existingUser = await userRepository.findOne({
                where: { email: userData.email }
            });
            if (existingUser) {
                throw new Error('Email already registered');
            }
            const hashedPassword = await (0, password_utils_1.hashPassword)(userData.password);
            const user = userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
            await userRepository.save(user);
            const token = (0, jwt_utils_1.generateToken)(user.id);
            return { user, token };
        }
        catch (error) {
            console.error('[AuthService] Register error:', error);
            if (error.message === 'Database connection not initialized') {
                throw new Error('Service temporarily unavailable');
            }
            throw error;
        }
    }
    static async login(email, password) {
        try {
            const userRepository = this.getUserRepository();
            const user = await userRepository.findOne({
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
        catch (error) {
            console.error('[AuthService] Login error:', error);
            if (error.message === 'Database connection not initialized') {
                throw new Error('Service temporarily unavailable');
            }
            throw error;
        }
    }
}
exports.AuthService = AuthService;
