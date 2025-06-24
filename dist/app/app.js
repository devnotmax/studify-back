"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const _index_route_1 = __importDefault(require("./routes/_index.route"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const error_middleware_1 = require("../middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(config_1.corsconfig));
app.use(express_1.default.json(config_1.jsonConfig));
app.use(express_1.default.urlencoded(config_1.urlencodeconfig));
app.use((0, morgan_1.default)("dev"));
app.use("/api", _index_route_1.default);
// Middleware de manejo de errores (debe ir después de las rutas)
app.use((err, req, res, next) => {
    (0, error_middleware_1.errorHandler)(err, req, res, next);
});
exports.default = app;
