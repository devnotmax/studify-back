import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../app/config/database/connection';

export const checkDatabaseConnection = (req: Request, res: Response, next: NextFunction): void => {
    if (!AppDataSource.isInitialized) {
        console.log('[Database Middleware] Database not connected, returning error');
        res.status(503).json({
            message: 'Service temporarily unavailable - Database connection not established',
            error: 'DATABASE_UNAVAILABLE'
        });
        return;
    }
    
    console.log('[Database Middleware] Database connected, proceeding');
    next();
}; 