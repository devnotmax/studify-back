import debug from "debug";
import { config } from "dotenv";
import multer, { memoryStorage } from "multer";
import { CorsOptions } from "cors";

config();

export const server = debug("nodets:[server]");
export const error = debug("nodets:[error]");
export const database = debug("nodets:[database]");
export const input = debug("nodets:[input]");

export const port = process.env.PORT ? Number(process.env.PORT) : 3000;
export const origin = process.env.origin;
export const NODE_ENV = process.env.NODE_ENV;

// Configuración de CORS para desarrollo y producción
const getCorsOrigins = () => {
  // Permitir todos los orígenes para desarrollo y producción
  return ["*"];
};

export const corsconfig: CorsOptions = {
  origin: true, // Permitir todos los orígenes
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 horas
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
