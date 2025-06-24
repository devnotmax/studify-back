import { Request, Response } from "express";
import { AchievementService } from "../services/achievement.service";

export const getUserAchievements = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const achievements = await AchievementService.getUserAchievements(userId);

        res.status(200).json({
            achievements
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los logros del usuario",
            error
        });
    }
};

export const checkAchievements = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const newAchievements = await AchievementService.checkAchievements(userId);

        res.status(200).json({
            message: "Logros verificados correctamente",
            newAchievements
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al verificar los logros",
            error
        });
    }
}; 