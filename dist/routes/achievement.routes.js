"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const achievement_controller_1 = require("../controllers/achievement.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Obtener logros del usuario
router.get("/", auth_middleware_1.authMiddleware, achievement_controller_1.getUserAchievements);
// Verificar logros
router.post("/check", auth_middleware_1.authMiddleware, achievement_controller_1.checkAchievements);
exports.default = router;
