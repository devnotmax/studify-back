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
app.use("/api", router);

// Middleware de manejo de errores (debe ir después de las rutas)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});

export default app;
