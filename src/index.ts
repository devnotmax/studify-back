import "reflect-metadata";
import app from "./app/app";
import { port, server } from "./app/config";
import { connectDB } from "./app/config/database/connection";
import authRoutes from "./routes/auth.routes";

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    server("running in port", port);
});