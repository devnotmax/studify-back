"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    // Error de sintaxis JSON
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            status: 'error',
            message: 'Formato JSON inválido'
        });
    }
    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Datos de entrada inválidos'
        });
    }
    // Error de autenticación
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'No autorizado'
        });
    }
    // Error por defecto
    console.error(err);
    return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};
exports.errorHandler = errorHandler;
