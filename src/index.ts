import "reflect-metadata";
import app from "./app/app";
import { port, server } from "./app/config";
import { connectDB } from "./app/config/database/connection";
import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";
import achievementRoutes from "./routes/achievement.routes";
import { setupSwagger } from "./swagger/swagger"; // <--- Agrega esta línea

// Conectar a la base de datos
connectDB();

// Swagger docs
setupSwagger(app); // <--- Agrega esta línea

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/achievements", achievementRoutes);

app.listen(port, () => {
  server("running in port", port);
});
