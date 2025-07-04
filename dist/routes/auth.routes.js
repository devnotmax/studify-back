"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const database_middleware_1 = require("../middlewares/database.middleware");
const router = (0, express_1.Router)();
// Aplicar middleware de verificación de base de datos a todas las rutas de auth
router.use(database_middleware_1.checkDatabaseConnection);
router.post('/register', auth_controller_1.AuthController.register);
router.post('/login', auth_controller_1.AuthController.login);
exports.default = router;
