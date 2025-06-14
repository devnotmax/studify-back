import { AppDataSource } from "../app/config/database/connection";
import { User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password.utils";
import { generateToken } from "../utils/jwt.utils";
import { IUser } from "../interfaces/user.interface";

export class AuthService {
    private static userRepository = AppDataSource.getRepository(User);

    static async register(userData: Partial<IUser>) {
        const existingUser = await this.userRepository.findOne({ 
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await hashPassword(userData.password!);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword
        });

        await this.userRepository.save(user);
        const token = generateToken(user.id);
        return { user, token };
    }

    static async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ 
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
    }
} 