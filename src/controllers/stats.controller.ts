import { Request, Response } from 'express';
import { StatsService } from '../services/stats.service';
import { StreakService } from '../services/streak.service';

export class StatsController {
    static async productivityHours(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const data = await StatsService.getProductivityHours(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async weeklyProductivity(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const data = await StatsService.getWeeklyProductivity(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async typeDistribution(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const data = await StatsService.getTypeDistribution(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async dailyHistory(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const days = parseInt(req.query.days) || 30;
            const data = await StatsService.getDailyHistory(userId, days);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async monthlyProductivity(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const data = await StatsService.getMonthlyProductivity(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async streak(req: any, res: Response) {
        try {
            const userId = req.user.id;
            // Usar la lógica corregida de StreakService
            const data = await StreakService.getStreakInfo(userId);
            res.json({ streak: data });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async averageSessionDuration(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const data = await StatsService.getAverageSessionDuration(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async sessionStatus(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const data = await StatsService.getSessionStatus(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async weeklyInMonth(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const data = await StatsService.getWeeklyInMonth(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
} 