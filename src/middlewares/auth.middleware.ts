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
        console.log('[AUTH] Petición recibida:', req.method, req.originalUrl);
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('[AUTH] No token provided');
            res.status(401).json({
                message: 'No token provided'
            });
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        } catch (jwtError) {
            console.log('[AUTH] Token inválido:', jwtError);
            res.status(401).json({
                message: 'Invalid token'
            });
            return;
        }
        const userRepository = AppDataSource.getRepository(User);
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
    } catch (error) {
        console.log('[AUTH] Error inesperado:', error);
        res.status(401).json({
            message: 'Invalid token'
        });
        return;
    }
}; 