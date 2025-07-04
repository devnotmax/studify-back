import { AppDataSource } from "../app/config/database/connection";
import { UserStats } from "../models/user-stats.model";
import { addDays, isSameDay, startOfDay } from "date-fns";

export class StreakService {
  private static userStatsRepository = AppDataSource.getRepository(UserStats);

  static async updateStreak(userId: string): Promise<UserStats> {
    let userStats = await this.userStatsRepository.findOne({
      where: { user: { id: userId } },
    });

    console.log("Estadísticas encontradas para usuario:", userId, userStats);

    if (!userStats) {
      // Crear estadísticas del usuario si no existen
      console.log("Creando estadísticas para usuario:", userId);
      userStats = new UserStats();
      userStats.totalSessions = 0;
      userStats.totalTime = 0;
      userStats.averageSessionDuration = 0;
      userStats.longestSession = 0;
      userStats.longestSessionDate = new Date();
      userStats.totalFocusTime = 0;
      userStats.totalBreakTime = 0;
      userStats.totalLongBreakTime = 0;
      userStats.currentStreak = 0; // Inicializar en 0, se actualizará abajo
      userStats.longestStreak = 0; // Inicializar en 0, se actualizará abajo
      userStats.lastActivityDate = new Date(0); // Inicializar en fecha muy antigua para que se procese correctamente
      userStats.user = { id: userId } as any;
      await this.userStatsRepository.save(userStats);
      // NO retornar aquí, continuar con la lógica de actualización
    }

    const today = startOfDay(new Date());
    const lastActivity = userStats.lastActivityDate
      ? startOfDay(userStats.lastActivityDate)
      : null;

    console.log("Actualizando racha:", {
      userId,
      currentStreak: userStats.currentStreak,
      longestStreak: userStats.longestStreak,
      lastActivity: lastActivity,
      lastActivityOriginal: userStats.lastActivityDate,
      today: today,
      todayOriginal: new Date(),
      isSameDay: lastActivity ? isSameDay(lastActivity, today) : false,
      isYesterday: lastActivity ? isSameDay(lastActivity, addDays(today, -1)) : false
    });

    // Si no hay actividad previa, establecer racha inicial
    if (!lastActivity) {
      userStats.currentStreak = 1;
      userStats.longestStreak = Math.max(userStats.longestStreak, 1);
      userStats.lastActivityDate = today;
      return await this.userStatsRepository.save(userStats);
    }

    // Si la última actividad fue ayer, incrementar la racha
    if (isSameDay(lastActivity, addDays(today, -1))) {
      userStats.currentStreak += 1;
      userStats.longestStreak = Math.max(userStats.longestStreak, userStats.currentStreak);
      console.log("Racha incrementada a:", userStats.currentStreak);
    }
    // Si la última actividad fue hoy, mantener la racha (no hacer nada)
    else if (isSameDay(lastActivity, today)) {
      console.log("Manteniendo racha actual:", userStats.currentStreak);
    }
    // Si la última actividad fue hace más de un día, reiniciar la racha
    else {
      userStats.currentStreak = 1;
      console.log("Racha reiniciada a 1");
    }

    userStats.lastActivityDate = today;
    return await this.userStatsRepository.save(userStats);
  }

  static async getStreakInfo(
    userId: string
  ): Promise<{
    currentStreak?: number;
    longestStreak?: number;
    lastActivityDate?: Date | null;
    message?: string;
  }> {
    const userStats = await this.userStatsRepository.findOne({
      where: { user: { id: userId } },
    });

    console.log("getStreakInfo - Estadísticas encontradas:", userStats);

    if (!userStats) {
      return {
        message: "User has no streak information yet.",
      };
    }

    const result = {
      currentStreak: userStats.currentStreak,
      longestStreak: userStats.longestStreak,
      lastActivityDate: userStats.lastActivityDate,
    };

    console.log("getStreakInfo - Resultado:", result);
    return result;
  }
}
