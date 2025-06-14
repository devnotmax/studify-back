import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { user, token } = await AuthService.register(req.body);
            res.status(201).json({
                message: 'User registered successfully',
                user,
                token
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);
            res.json({
                message: 'Login successful',
                user,
                token
            });
        } catch (error: any) {
            res.status(401).json({
                message: error.message
            });
        }
    }
} 