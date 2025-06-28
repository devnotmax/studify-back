import { AppDataSource } from "../app/config/database/connection";
import { User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password.utils";
import { generateToken } from "../utils/jwt.utils";
import { IUser } from "../interfaces/user.interface";

export class AuthService {
    private static getUserRepository() {
        if (!AppDataSource.isInitialized) {
            throw new Error('Database connection not initialized');
        }
        return AppDataSource.getRepository(User);
    }

    static async register(userData: Partial<IUser>) {
        try {
            const userRepository = this.getUserRepository();
            
            const existingUser = await userRepository.findOne({ 
                where: { email: userData.email }
            });

            if (existingUser) {
                throw new Error('Email already registered');
            }

            const hashedPassword = await hashPassword(userData.password!);
            const user = userRepository.create({
                ...userData,
                password: hashedPassword
            });

            await userRepository.save(user);
            const token = generateToken(user.id);
            return { user, token };
        } catch (error: any) {
            console.error('[AuthService] Register error:', error);
            if (error.message === 'Database connection not initialized') {
                throw new Error('Service temporarily unavailable');
            }
            throw error;
        }
    }

    static async login(email: string, password: string) {
        try {
            const userRepository = this.getUserRepository();
            
            const user = await userRepository.findOne({ 
                where: { email }
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            const token = generateToken(user.id);
            return { user, token };
        } catch (error: any) {
            console.error('[AuthService] Login error:', error);
            if (error.message === 'Database connection not initialized') {
                throw new Error('Service temporarily unavailable');
            }
            throw error;
        }
    }
} 