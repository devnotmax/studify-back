"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementService = void 0;
const connection_1 = require("../app/config/database/connection");
const achievement_model_1 = require("../models/achievement.model");
const user_model_1 = require("../models/user.model");
const session_model_1 = require("../models/session.model");
class AchievementService {
    static async checkAchievements(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["achievements", "sessions"]
        });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        const completedSessions = user.sessions.filter(session => session.isCompleted);
        const totalFocusTime = completedSessions.reduce((acc, session) => acc + session.completedTime, 0);
        const totalSessions = completedSessions.length;
        // Definir logros predefinidos
        const predefinedAchievements = [
            {
                name: "Primera Sesión",
                description: "Completa tu primera sesión de focus",
                condition: "sessions",
                conditionValue: 1
            },
            {
                name: "Focus Master",
                description: "Completa 25 sesiones de focus",
                condition: "sessions",
                conditionValue: 25
            },
            {
                name: "Time Warrior",
                description: "Acumula 10 horas de tiempo de focus",
                condition: "focusTime",
                conditionValue: 36000 // 10 horas en segundos
            }
        ];
        const newAchievements = [];
        for (const achievement of predefinedAchievements) {
            const existingAchievement = user.achievements.find(a => a.name === achievement.name);
            if (!existingAchievement) {
                let isCompleted = false;
                if (achievement.condition === "sessions" && totalSessions >= achievement.conditionValue) {
                    isCompleted = true;
                }
                else if (achievement.condition === "focusTime" && totalFocusTime >= achievement.conditionValue) {
                    isCompleted = true;
                }
                if (isCompleted) {
                    const newAchievement = this.achievementRepository.create(Object.assign(Object.assign({}, achievement), { user, isCompleted: true, completedAt: new Date() }));
                    await this.achievementRepository.save(newAchievement);
                    newAchievements.push(newAchievement);
                }
            }
        }
        return newAchievements;
    }
    static async getUserAchievements(userId) {
        return await this.achievementRepository.find({
            where: { user: { id: userId } },
            order: { completedAt: "DESC" }
        });
    }
}
exports.AchievementService = AchievementService;
AchievementService.achievementRepository = connection_1.AppDataSource.getRepository(achievement_model_1.Achievement);
AchievementService.userRepository = connection_1.AppDataSource.getRepository(user_model_1.User);
AchievementService.sessionRepository = connection_1.AppDataSource.getRepository(session_model_1.Session);
