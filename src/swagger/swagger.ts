// src/app/config/swagger.ts
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import YAML from "yamljs";
import path from "path";
import fs from "fs";

// Intentar cargar swagger.yaml desde src/swagger primero, luego dist/swagger
let swaggerPath = path.join(__dirname, "swagger.yaml");
if (!fs.existsSync(swaggerPath)) {
  // Si no existe en el mismo directorio, buscar en ../../src/swagger (para producción)
  swaggerPath = path.join(process.cwd(), "src", "swagger", "swagger.yaml");
  if (!fs.existsSync(swaggerPath)) {
    throw new Error("No se encontró swagger.yaml en ninguna ruta conocida");
  }
}

const swaggerDocument = YAML.load(swaggerPath);

export function setupSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
