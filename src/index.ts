import "reflect-metadata";
import app from "./app/app";
import { port, server } from "./app/config";
import { connectDB } from "./app/config/database/connection";
import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";
import achievementRoutes from "./routes/achievement.routes";

console.log("[DEBUG] Iniciando conexión a la base de datos...");
connectDB()
  .then(() => {
    console.log("[DEBUG] Conexión a la base de datos exitosa.");
    // Rutas
    app.use("/api/auth", authRoutes);
    app.use("/api/sessions", sessionRoutes);
    app.use("/api/achievements", achievementRoutes);
    console.log("[DEBUG] Rutas configuradas.");

    console.log(`[DEBUG] Iniciando servidor en puerto: ${port}`);
    app.listen(port, () => {
      server("running in port", port);
      console.log(`[DEBUG] Servidor escuchando en puerto: ${port}`);
    });
  })
  .catch((err) => {
    console.error("[ERROR] Error al conectar a la base de datos:", err);
  });
