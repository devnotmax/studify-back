import { AppDataSource } from "../app/config/database/connection";
import { Achievement } from "../models/achievement.model";
import { User } from "../models/user.model";
import { Session } from "../models/session.model";

export class AchievementService {
    private static achievementRepository = AppDataSource.getRepository(Achievement);
    private static userRepository = AppDataSource.getRepository(User);
    private static sessionRepository = AppDataSource.getRepository(Session);

    static async checkAchievements(userId: string): Promise<Achievement[]> {
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

        const newAchievements: Achievement[] = [];

        for (const achievement of predefinedAchievements) {
            const existingAchievement = user.achievements.find(a => a.name === achievement.name);

            if (!existingAchievement) {
                let isCompleted = false;

                if (achievement.condition === "sessions" && totalSessions >= achievement.conditionValue) {
                    isCompleted = true;
                } else if (achievement.condition === "focusTime" && totalFocusTime >= achievement.conditionValue) {
                    isCompleted = true;
                }

                if (isCompleted) {
                    const newAchievement = this.achievementRepository.create({
                        ...achievement,
                        user,
                        isCompleted: true,
                        completedAt: new Date()
                    });

                    await this.achievementRepository.save(newAchievement);
                    newAchievements.push(newAchievement);
                }
            }
        }

        return newAchievements;
    }

    static async getUserAchievements(userId: string): Promise<Achievement[]> {
        return await this.achievementRepository.find({
            where: { user: { id: userId } },
            order: { completedAt: "DESC" }
        });
    }
} 