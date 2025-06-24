"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.urlencodeconfig = exports.jsonConfig = exports.corsconfig = exports.NODE_ENV = exports.origin = exports.port = exports.input = exports.database = exports.error = exports.server = void 0;
const debug_1 = __importDefault(require("debug"));
const dotenv_1 = require("dotenv");
const multer_1 = __importStar(require("multer"));
(0, dotenv_1.config)();
exports.server = (0, debug_1.default)("nodets:[server]");
exports.error = (0, debug_1.default)("nodets:[error]");
exports.database = (0, debug_1.default)("nodets:[database]");
exports.input = (0, debug_1.default)("nodets:[input]");
exports.port = process.env.PORT ? Number(process.env.PORT) : 3000;
exports.origin = process.env.origin;
exports.NODE_ENV = process.env.NODE_ENV;
// Configuración de CORS para desarrollo y producción
const getCorsOrigins = () => {
    // Permitir el frontend local y el dominio de producción
    return [
        'http://localhost:5173',
        'https://genuine-anette-devnotmax-69217c46.koyeb.app'
    ];
};
exports.corsconfig = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como aplicaciones móviles o Postman)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = getCorsOrigins();
        // Si está configurado para permitir todos los orígenes
        if (allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        // Verificar si el origen está permitido
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
exports.jsonConfig = {
    limit: "10mb", //payload limit
    strict: false, //only json
    inflate: true, //accept gzip and inflate
    type: "application/json",
};
exports.urlencodeconfig = {
    extended: true,
    limit: "10mb",
    parameterLimit: 1000,
};
exports.upload = (0, multer_1.default)({
    storage: (0, multer_1.memoryStorage)(),
    limits: { fileSize: 25 * 1024 * 1024 },
});
