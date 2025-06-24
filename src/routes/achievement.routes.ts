import { Router } from "express";
import { getUserAchievements, checkAchievements } from "../controllers/achievement.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Obtener logros del usuario
router.get("/", authMiddleware, getUserAchievements);

// Verificar logros
router.post("/check", authMiddleware, checkAchievements);

export default router; 