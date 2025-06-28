import "reflect-metadata";
import app from "./app/app";
import { port, server } from "./app/config";
import { connectDB } from "./app/config/database/connection";
import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";
import achievementRoutes from "./routes/achievement.routes";

const startServer = async () => {
  try {
    console.log("[DEBUG] Iniciando aplicación...");
    
    // Intentar conectar a la base de datos
    try {
      await connectDB();
      console.log("[DEBUG] Conexión a la base de datos exitosa.");
    } catch (dbError: any) {
      console.error("[WARNING] No se pudo conectar a la base de datos:", dbError?.message || dbError);
      console.log("[INFO] La aplicación continuará sin base de datos.");
    }

    // Configurar rutas
    app.use("/api/auth", authRoutes);
    app.use("/api/sessions", sessionRoutes);
    app.use("/api/achievements", achievementRoutes);
    console.log("[DEBUG] Rutas configuradas.");

    // Iniciar servidor
    console.log(`[DEBUG] Iniciando servidor en puerto: ${port}`);
    app.listen(port, () => {
      server("running in port", port);
      console.log(`[DEBUG] Servidor escuchando en puerto: ${port}`);
      console.log(`[INFO] Health check disponible en: http://localhost:${port}/health`);
    });
  } catch (error) {
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
