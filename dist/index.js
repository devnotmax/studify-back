"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app/app"));
const config_1 = require("./app/config");
const connection_1 = require("./app/config/database/connection");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Conectar a la base de datos
(0, connection_1.connectDB)();
// Rutas
app_1.default.use('/api/auth', auth_routes_1.default);
app_1.default.listen(config_1.port, () => {
    (0, config_1.server)("running in port", config_1.port);
});
