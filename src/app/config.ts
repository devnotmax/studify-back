import debug from "debug";
import { config } from "dotenv";
import multer, { memoryStorage } from "multer";
import { CorsOptions } from "cors";

config();

export const server = debug("nodets:[server]");
export const error = debug("nodets:[error]");
export const database = debug("nodets:[database]");
export const input = debug("nodets:[input]");

export const { port, origin, NODE_ENV } = process.env;

// Configuración de CORS para desarrollo y producción
const getCorsOrigins = () => {
    // Por ahora, permitir todos los orígenes
    return ['*'];
    
    // TODO: Configurar orígenes específicos más adelante
    // Si hay una variable de entorno específica para CORS, usarla
    // if (origin) {
    //     const origins = origin.split(',').map(origin => origin.trim());
    //     // En desarrollo, asegurar que localhost:5173 esté incluido
    //     if (NODE_ENV === 'development' && !origins.includes('http://localhost:5173')) {
    //         origins.push('http://localhost:5173');
    //     }
    //     return origins;
    // }

    // // En desarrollo, permitir localhost
    // if (NODE_ENV === 'development') {
    //     return [
    //         'http://localhost:3000',
    //         'http://localhost:3001', 
    //         'http://localhost:5173', // Vite default
    //         'http://localhost:8080', // Vue CLI default
    //         'http://127.0.0.1:3000',
    //         'http://127.0.0.1:3001',
    //         'http://127.0.0.1:5173',
    //         'http://127.0.0.1:8080'
    //     ];
    // }

    // // En producción, permitir cualquier origen (o configurar específicos)
    // // Puedes cambiar esto por dominios específicos si quieres más seguridad
    // return ['*'];
};

export const corsconfig: CorsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como aplicaciones móviles o Postman)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = getCorsOrigins();
        
        // Si está configurado para permitir todos los orígenes
        if (allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        
        // Verificar si el origen está permitido
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 horas
};

export const jsonConfig = {
    limit: "10mb", //payload limit
    strict: false, //only json
    inflate: true, //accept gzip and inflate
    type: "application/json",
};

export const urlencodeconfig = {
    extended: true,
    limit: "10mb",
    parameterLimit: 1000,
};

export const upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 },
});
