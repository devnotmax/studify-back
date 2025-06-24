import { AppDataSource } from "../app/config/database/connection";
import { UserStats } from "../models/user-stats.model";
import { addDays, isSameDay, startOfDay } from "date-fns";

export class StreakService {
    private static userStatsRepository = AppDataSource.getRepository(UserStats);

    static async updateStreak(userId: string): Promise<UserStats> {
        const userStats = await this.userStatsRepository.findOne({
            where: { user: { id: userId } }
        });

        if (!userStats) {
            throw new Error('User stats not found');
        }

        const today = startOfDay(new Date());
        const lastActivity = userStats.lastActivityDate ? startOfDay(userStats.lastActivityDate) : null;

        // Si es el primer día de actividad
        if (!lastActivity) {
            userStats.currentStreak = 1;
            userStats.longestStreak = 1;
            userStats.lastActivityDate = today;
            return await this.userStatsRepository.save(userStats);
        }

        // Si la última actividad fue ayer, incrementar la racha
        if (isSameDay(lastActivity, addDays(today, -1))) {
            userStats.currentStreak += 1;
            if (userStats.currentStreak > userStats.longestStreak) {
                userStats.longestStreak = userStats.currentStreak;
            }
        }
        // Si la última actividad fue hoy, mantener la racha
        else if (isSameDay(lastActivity, today)) {
            // No hacer nada, mantener la racha actual
        }
        // Si la última actividad fue hace más de un día, reiniciar la racha
        else {
            userStats.currentStreak = 1;
        }

        userStats.lastActivityDate = today;
        return await this.userStatsRepository.save(userStats);
    }

    static async getStreakInfo(userId: string): Promise<{ currentStreak: number; longestStreak: number; lastActivityDate: Date | null }> {
        const userStats = await this.userStatsRepository.findOne({
            where: { user: { id: userId } }
        });

        if (!userStats) {
            throw new Error('User stats not found');
        }

        return {
            currentStreak: userStats.currentStreak,
            longestStreak: userStats.longestStreak,
            lastActivityDate: userStats.lastActivityDate
        };
    }
} 