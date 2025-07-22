"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreakService = void 0;
const connection_1 = require("../app/config/database/connection");
const user_stats_model_1 = require("../models/user-stats.model");
const date_fns_1 = require("date-fns");
class StreakService {
    static async updateStreak(userId) {
        let userStats = await this.userStatsRepository.findOne({
            where: { user: { id: userId } },
        });
        const today = (0, date_fns_1.startOfDay)(new Date());
        if (!userStats) {
            console.log("Creando estadísticas para usuario:", userId);
            userStats = new user_stats_model_1.UserStats();
            userStats.user = { id: userId };
            userStats.currentStreak = 1;
            userStats.longestStreak = 1;
            userStats.lastActivityDate = today;
            return await this.userStatsRepository.save(userStats);
        }
        const lastActivity = userStats.lastActivityDate
            ? (0, date_fns_1.startOfDay)(userStats.lastActivityDate)
            : null;
        console.log("Actualizando racha (updateStreak):", {
            userId,
            currentStreak: userStats.currentStreak,
            lastActivity: lastActivity,
            today: today,
        });
        if (lastActivity && (0, date_fns_1.isSameDay)(lastActivity, today)) {
            console.log("La actividad de hoy ya fue registrada. La racha se mantiene.");
            return userStats;
        }
        if (lastActivity && (0, date_fns_1.isSameDay)(lastActivity, (0, date_fns_1.addDays)(today, -1))) {
            userStats.currentStreak += 1;
            console.log("Racha incrementada a:", userStats.currentStreak);
        }
        else {
            userStats.currentStreak = 1;
            console.log("Racha reiniciada a 1 por nueva sesión.");
        }
        userStats.longestStreak = Math.max(userStats.longestStreak, userStats.currentStreak);
        userStats.lastActivityDate = today;
        return await this.userStatsRepository.save(userStats);
    }
    static async getStreakInfo(userId) {
        const userStats = await this.userStatsRepository.findOne({
            where: { user: { id: userId } },
        });
        if (!userStats) {
            return {
                message: "El usuario aún no tiene información de racha.",
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: null,
            };
        }
        const today = (0, date_fns_1.startOfDay)(new Date());
        const lastActivity = userStats.lastActivityDate
            ? (0, date_fns_1.startOfDay)(userStats.lastActivityDate)
            : null;
        let calculatedStreak = userStats.currentStreak;
        if (!lastActivity || (!(0, date_fns_1.isSameDay)(lastActivity, today) && !(0, date_fns_1.isSameDay)(lastActivity, (0, date_fns_1.addDays)(today, -1)))) {
            calculatedStreak = 0;
        }
        const result = {
            currentStreak: calculatedStreak,
            longestStreak: userStats.longestStreak,
            lastActivityDate: userStats.lastActivityDate,
        };
        console.log("getStreakInfo - Resultado calculado:", result);
        return result;
    }
}
exports.StreakService = StreakService;
StreakService.userStatsRepository = connection_1.AppDataSource.getRepository(user_stats_model_1.UserStats);
