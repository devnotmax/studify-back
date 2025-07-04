"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = void 0;
const connection_1 = require("../app/config/database/connection");
const checkDatabaseConnection = (req, res, next) => {
    if (!connection_1.AppDataSource.isInitialized) {
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
exports.checkDatabaseConnection = checkDatabaseConnection;
