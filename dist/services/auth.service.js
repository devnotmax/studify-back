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
exports.AuthService = void 0;
const connection_1 = require("../app/config/database/connection");
const user_model_1 = require("../models/user.model");
const password_utils_1 = require("../utils/password.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
class AuthService {
    static register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findOne({
                where: { email: userData.email }
            });
            if (existingUser) {
                throw new Error('Email already registered');
            }
            const hashedPassword = yield (0, password_utils_1.hashPassword)(userData.password);
            const user = this.userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
            yield this.userRepository.save(user);
            const token = (0, jwt_utils_1.generateToken)(user.id);
            return { user, token };
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { email }
            });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const isValidPassword = yield (0, password_utils_1.comparePassword)(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }
            const token = (0, jwt_utils_1.generateToken)(user.id);
            return { user, token };
        });
    }
}
exports.AuthService = AuthService;
AuthService.userRepository = connection_1.AppDataSource.getRepository(user_model_1.User);
