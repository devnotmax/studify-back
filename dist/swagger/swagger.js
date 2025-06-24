"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
// src/app/config/swagger.ts
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Intentar cargar swagger.yaml desde src/swagger primero, luego dist/swagger
let swaggerPath = path_1.default.join(__dirname, "swagger.yaml");
if (!fs_1.default.existsSync(swaggerPath)) {
    // Si no existe en el mismo directorio, buscar en ../../src/swagger (para producción)
    swaggerPath = path_1.default.join(process.cwd(), "src", "swagger", "swagger.yaml");
    if (!fs_1.default.existsSync(swaggerPath)) {
        throw new Error("No se encontró swagger.yaml en ninguna ruta conocida");
    }
}
const swaggerDocument = yamljs_1.default.load(swaggerPath);
function setupSwagger(app) {
    app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
