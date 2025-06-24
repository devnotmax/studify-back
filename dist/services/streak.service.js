"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreakService = void 0;
const connection_1 = require("../app/config/database/connection");
const user_stats_model_1 = require("../models/user-stats.model");
const date_fns_1 = require("date-fns");
class StreakService {
    static async updateStreak(userId) {
        const userStats = await this.userStatsRepository.findOne({
            where: { user: { id: userId } }
        });
        if (!userStats) {
            throw new Error('User stats not found');
        }
        const today = (0, date_fns_1.startOfDay)(new Date());
        const lastActivity = userStats.lastActivityDate ? (0, date_fns_1.startOfDay)(userStats.lastActivityDate) : null;
        // Si es el primer día de actividad
        if (!lastActivity) {
            userStats.currentStreak = 1;
            userStats.longestStreak = 1;
            userStats.lastActivityDate = today;
            return await this.userStatsRepository.save(userStats);
        }
        // Si la última actividad fue ayer, incrementar la racha
        if ((0, date_fns_1.isSameDay)(lastActivity, (0, date_fns_1.addDays)(today, -1))) {
            userStats.currentStreak += 1;
            if (userStats.currentStreak > userStats.longestStreak) {
                userStats.longestStreak = userStats.currentStreak;
            }
        }
        // Si la última actividad fue hoy, mantener la racha
        else if ((0, date_fns_1.isSameDay)(lastActivity, today)) {
            // No hacer nada, mantener la racha actual
        }
        // Si la última actividad fue hace más de un día, reiniciar la racha
        else {
            userStats.currentStreak = 1;
        }
        userStats.lastActivityDate = today;
        return await this.userStatsRepository.save(userStats);
    }
    static async getStreakInfo(userId) {
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
exports.StreakService = StreakService;
StreakService.userStatsRepository = connection_1.AppDataSource.getRepository(user_stats_model_1.UserStats);
