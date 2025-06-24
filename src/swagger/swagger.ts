// src/app/config/swagger.ts
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import YAML from "yamljs";
import path from "path";

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

export function setupSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
