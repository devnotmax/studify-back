"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../../app/config");
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_config_1 = require("./supabase-config");
dotenv_1.default.config();
const isProd = process.env.NODE_ENV === "production";
const entitiesPath = isProd ? "dist/models/**/*.js" : "src/models/**/*.ts";
const migrationsPath = isProd ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts";
const subscribersPath = isProd ? "dist/subscribers/**/*.js" : "src/subscribers/**/*.ts";
console.log("[DEBUG] Entities path:", entitiesPath);
console.log("[DEBUG] Migrations path:", migrationsPath);
console.log("[DEBUG] Subscribers path:", subscribersPath);
// Usar la configuración específica para Supabase
exports.AppDataSource = new typeorm_1.DataSource((0, supabase_config_1.getSupabaseDatabaseConfig)());
const connectDB = async () => {
    try {
        console.log("[DEBUG] Iniciando conexión a la base de datos...");
        console.log("[DEBUG] NODE_ENV:", process.env.NODE_ENV);
        console.log("[DEBUG] DATABASE_URL exists:", !!process.env.DATABASE_URL);
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout al conectar a la base de datos")), 30000));
        await Promise.race([exports.AppDataSource.initialize(), timeout]);
        (0, config_1.database)("PostgreSQL Connected");
        console.log("[DEBUG] Conexión a la base de datos establecida exitosamente");
    }
    catch (error) {
        console.error("Error connecting to PostgreSQL:", error);
        console.error("[DEBUG] Error details:", {
            message: error.message,
            code: error.code,
            errno: error.errno,
            syscall: error.syscall,
            address: error.address,
            port: error.port
        });
        // En producción, no salir inmediatamente, dar tiempo para reintentos
        if (!isProd) {
            process.exit(1);
        }
        else {
            console.log("[DEBUG] En producción, continuando sin conexión a BD...");
            throw error; // Re-lanzar el error para que el manejador principal lo capture
        }
    }
};
exports.connectDB = connectDB;
