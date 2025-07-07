"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// Configurar Node.js para aceptar certificados SSL no confiables (específico para Supabase)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const app_1 = __importDefault(require("./app/app"));
const config_1 = require("./app/config");
const connection_1 = require("./app/config/database/connection");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const achievement_routes_1 = __importDefault(require("./routes/achievement.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const startServer = async () => {
    try {
        console.log("[DEBUG] Iniciando aplicación...");
        console.log("[DEBUG] NODE_TLS_REJECT_UNAUTHORIZED:", process.env.NODE_TLS_REJECT_UNAUTHORIZED);
        // Intentar conectar a la base de datos
        try {
            await (0, connection_1.connectDB)();
            console.log("[DEBUG] Conexión a la base de datos exitosa.");
        }
        catch (dbError) {
            console.error("[WARNING] No se pudo conectar a la base de datos:", dbError.message);
            console.log("[INFO] La aplicación continuará sin base de datos.");
        }
        // Configurar rutas
        app_1.default.use("/api/auth", auth_routes_1.default);
        app_1.default.use("/api/sessions", session_routes_1.default);
        app_1.default.use("/api/achievements", achievement_routes_1.default);
        app_1.default.use("/api/stats", stats_routes_1.default);
        console.log("[DEBUG] Rutas configuradas.");
        // Iniciar servidor
        console.log(`[DEBUG] Iniciando servidor en puerto: ${config_1.port}`);
        app_1.default.listen(config_1.port, () => {
            (0, config_1.server)("running in port", config_1.port);
            console.log(`[DEBUG] Servidor escuchando en puerto: ${config_1.port}`);
            console.log(`[INFO] Health check disponible en: http://localhost:${config_1.port}/health`);
        });
    }
    catch (error) {
        console.error("[ERROR] Error fatal al iniciar la aplicación:", error);
        process.exit(1);
    }
};
// Manejar señales de terminación
process.on('SIGTERM', () => {
    console.log('[INFO] Recibida señal SIGTERM, cerrando servidor...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('[INFO] Recibida señal SIGINT, cerrando servidor...');
    process.exit(0);
});
// Iniciar la aplicación
startServer();
