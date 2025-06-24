"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAchievements = exports.getUserAchievements = void 0;
const achievement_service_1 = require("../services/achievement.service");
const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
        const achievements = await achievement_service_1.AchievementService.getUserAchievements(userId);
        res.status(200).json({
            achievements
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener los logros del usuario",
            error
        });
    }
};
exports.getUserAchievements = getUserAchievements;
const checkAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
        const newAchievements = await achievement_service_1.AchievementService.checkAchievements(userId);
        res.status(200).json({
            message: "Logros verificados correctamente",
            newAchievements
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al verificar los logros",
            error
        });
    }
};
exports.checkAchievements = checkAchievements;
