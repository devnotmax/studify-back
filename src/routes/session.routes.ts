import { Router } from "express";
import {
  startSession,
  endSession,
  cancelSession,
  getActiveSession,
  getSessionHistory,
  getStreakInfo,
  getSessionStats,
} from "../controllers/session.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Iniciar una nueva sesión
router.post("/", authMiddleware, startSession);

// Finalizar una sesión
router.put("/:sessionId/end", authMiddleware, endSession);

// Cancelar una sesión
router.put("/:sessionId/cancel", authMiddleware, cancelSession);

// Obtener sesión activa
router.get("/active", authMiddleware, getActiveSession);

// Obtener historial de sesiones
router.get("/history", authMiddleware, getSessionHistory);

// Obtener información de la racha
router.get("/streak", authMiddleware, getStreakInfo);

// Obtener estadísticas de sesiones (hoy, semana, total)
router.get("/stats", authMiddleware, getSessionStats);

// Pausar sesión
router.put("/:sessionId/pause", authMiddleware, require('../controllers/session.controller').pauseSession);

// Reanudar sesión
router.put("/:sessionId/resume", authMiddleware, require('../controllers/session.controller').resumeSession);

// Obtener tiempo restante real
router.get("/:sessionId/remaining", authMiddleware, require('../controllers/session.controller').getSessionRemaining);

export default router;
