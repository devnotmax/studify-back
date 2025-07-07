"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const stats_service_1 = require("../services/stats.service");
class StatsController {
    static async productivityHours(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getProductivityHours(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async weeklyProductivity(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getWeeklyProductivity(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async typeDistribution(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getTypeDistribution(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async dailyHistory(req, res) {
        try {
            const userId = req.user.id;
            const days = parseInt(req.query.days) || 30;
            const data = await stats_service_1.StatsService.getDailyHistory(userId, days);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async monthlyProductivity(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getMonthlyProductivity(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async streak(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getStreak(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async averageSessionDuration(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getAverageSessionDuration(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async sessionStatus(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getSessionStatus(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async weeklyInMonth(req, res) {
        try {
            const userId = req.user.id;
            const data = await stats_service_1.StatsService.getWeeklyInMonth(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.StatsController = StatsController;
