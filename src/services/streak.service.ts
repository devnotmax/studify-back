import { AppDataSource } from "../app/config/database/connection";
import { UserStats } from "../models/user-stats.model";
import { Session } from "../models/session.model";
import { addDays, startOfDay, differenceInCalendarDays } from "date-fns";

export class StreakService {
  private static userStatsRepository = AppDataSource.getRepository(UserStats);
  private static sessionRepository = AppDataSource.getRepository(Session);

  static async updateStreak(userId: string): Promise<UserStats> {
    const { currentStreak, longestStreak, lastActivityDate } = await this.calculateStreakFromSessions(userId);

    let userStats = await this.userStatsRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!userStats) {
      userStats = this.userStatsRepository.create({
        user: { id: userId } as any,
        currentStreak: 0,
        longestStreak: 0,
      });
    }

    userStats.currentStreak = currentStreak;
    if (lastActivityDate) {
      userStats.lastActivityDate = lastActivityDate;
    }
    userStats.longestStreak = longestStreak;

    console.log("Estadísticas de racha actualizadas:", { currentStreak, longestStreak });
    return await this.userStatsRepository.save(userStats);
  }

  static async getStreakInfo(
    userId: string
  ): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date | null;
  }> {
    return this.calculateStreakFromSessions(userId);
  }

  private static async calculateStreakFromSessions(userId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date | null;
  }> {
    const sessions = await this.sessionRepository.find({
      where: { userId, isCompleted: true },
      order: { endTime: "DESC" },
    });

    const userStats = await this.userStatsRepository.findOne({ where: { user: { id: userId } } });
    const longestStreak = userStats?.longestStreak || 0;

    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak, lastActivityDate: null };
    }

    const activityDays = new Set(
      sessions.filter((s) => s.endTime).map((s) => startOfDay(s.endTime!).toISOString())
    );

    let currentStreak = 0;
    const today = startOfDay(new Date());
    const lastActivityDay = startOfDay(sessions[0].endTime!);

    if (differenceInCalendarDays(today, lastActivityDay) > 1) {
      currentStreak = 0;
    } else {
      let currentDate = lastActivityDay;
      while (activityDays.has(currentDate.toISOString())) {
        currentStreak++;
        currentDate = addDays(currentDate, -1);
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastActivityDate: sessions[0].endTime,
    };
  }
}
