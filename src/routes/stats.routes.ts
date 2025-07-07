import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/productivity-hours', authMiddleware, StatsController.productivityHours);
router.get('/weekly-productivity', authMiddleware, StatsController.weeklyProductivity);
router.get('/type-distribution', authMiddleware, StatsController.typeDistribution);
router.get('/daily-history', authMiddleware, StatsController.dailyHistory);
router.get('/monthly-productivity', authMiddleware, StatsController.monthlyProductivity);
router.get('/streak', authMiddleware, StatsController.streak);
router.get('/average-session-duration', authMiddleware, StatsController.averageSessionDuration);
router.get('/session-status', authMiddleware, StatsController.sessionStatus);
router.get('/weekly-in-month', authMiddleware, StatsController.weeklyInMonth);

export default router; 