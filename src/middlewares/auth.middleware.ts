import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../app/config/database/connection';
import { User } from '../models/user.model';

export const authMiddleware = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                message: 'No token provided'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (!user) {
            res.status(401).json({
                message: 'User not found'
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token'
        });
        return;
    }
}; 