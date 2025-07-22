"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("../controllers/session.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Iniciar una nueva sesión
router.post("/", auth_middleware_1.authMiddleware, session_controller_1.startSession);
// Finalizar una sesión
router.put("/:sessionId/end", auth_middleware_1.authMiddleware, session_controller_1.endSession);
// Cancelar una sesión
router.put("/:sessionId/cancel", auth_middleware_1.authMiddleware, session_controller_1.cancelSession);
// Obtener sesión activa
router.get("/active", auth_middleware_1.authMiddleware, session_controller_1.getActiveSession);
// Obtener historial de sesiones
router.get("/history", auth_middleware_1.authMiddleware, session_controller_1.getSessionHistory);
// Obtener información de la racha
router.get("/streak", auth_middleware_1.authMiddleware, session_controller_1.getStreakInfo);
// Obtener estadísticas de sesiones (hoy, semana, total)
router.get("/stats", auth_middleware_1.authMiddleware, session_controller_1.getSessionStats);
// Pausar sesión
router.put("/:sessionId/pause", auth_middleware_1.authMiddleware, require('../controllers/session.controller').pauseSession);
// Reanudar sesión
router.put("/:sessionId/resume", auth_middleware_1.authMiddleware, require('../controllers/session.controller').resumeSession);
// Obtener tiempo restante real
router.get("/:sessionId/remaining", auth_middleware_1.authMiddleware, require('../controllers/session.controller').getSessionRemaining);
exports.default = router;
