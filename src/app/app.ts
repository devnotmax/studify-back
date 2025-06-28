import express from "express";
import morgan from "morgan";
import router from "./routes/_index.route";
import { corsconfig, jsonConfig, urlencodeconfig } from "./config";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "../middlewares/error.middleware";

const app = express();

app.use(helmet());
app.use(cors(corsconfig));
app.use(express.json(jsonConfig));
app.use(express.urlencoded(urlencodeconfig));
app.use(morgan("dev"));

// Middleware de logging para debuggear
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Health check para Render (en la raíz)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected' // Esto cambiará cuando conectemos la BD
    });
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        cors: 'Configurado'
    });
});

app.use("/api", router);

// Middleware de manejo de errores (debe ir después de las rutas)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});

export default app;
