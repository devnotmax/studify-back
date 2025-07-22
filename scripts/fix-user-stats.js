const { AppDataSource } = require("../dist/app/config/database/connection");
const { UserStats } = require("../dist/models/user-stats.model");
const { Session } = require("../dist/models/session.model");
const { addDays, isSameDay, startOfDay } = require("date-fns");

async function fixUserStats() {
    try {
        await AppDataSource.initialize();
        console.log("Base de datos conectada");

        const userStatsRepository = AppDataSource.getRepository(UserStats);
        const sessionRepository = AppDataSource.getRepository(Session);

        // Obtener todas las estadísticas de usuarios
        const allUserStats = await userStatsRepository.find({
            relations: ["user"]
        });

        console.log(`Encontradas ${allUserStats.length} estadísticas de usuarios`);

        for (const userStats of allUserStats) {
            console.log(`Procesando usuario: ${userStats.user.id}`);

            // Obtener todas las sesiones completadas del usuario
            const completedSessions = await sessionRepository.find({
                where: {
                    userId: userStats.user.id,
                    isCompleted: true,
                    isCancelled: false
                },
                order: {
                    endTime: "ASC"
                }
            });

            if (completedSessions.length === 0) {
                console.log(`Usuario ${userStats.user.id} no tiene sesiones completadas`);
                continue;
            }

            // Calcular estadísticas completas
            userStats.totalSessions = completedSessions.length;
            userStats.totalTime = completedSessions.reduce((acc, session) => acc + session.completedTime, 0);
            userStats.averageSessionDuration = userStats.totalSessions > 0 ? Math.round((userStats.totalTime / userStats.totalSessions) * 100) / 100 : 0;
            userStats.longestSession = 0;
            userStats.longestSessionDate = null;
            userStats.totalFocusTime = 0;
            userStats.totalBreakTime = 0;
            userStats.totalLongBreakTime = 0;
            for (const session of completedSessions) {
                if (session.completedTime > userStats.longestSession) {
                    userStats.longestSession = session.completedTime;
                    userStats.longestSessionDate = session.endTime;
                }
                if (session.sessionType === 'focus') {
                    userStats.totalFocusTime += session.completedTime;
                } else if (session.sessionType === 'short_break') {
                    userStats.totalBreakTime += session.completedTime;
                } else if (session.sessionType === 'long_break') {
                    userStats.totalLongBreakTime += session.completedTime;
                }
            }

            // Actualizar estadísticas
            await userStatsRepository.save(userStats);

            console.log(`Usuario ${userStats.user.id} actualizado:`, {
                totalSessions: completedSessions.length,
                totalTime: userStats.totalTime,
                averageSessionDuration: userStats.averageSessionDuration,
                longestSession: userStats.longestSession,
                longestSessionDate: userStats.longestSessionDate,
                totalFocusTime: userStats.totalFocusTime,
                totalBreakTime: userStats.totalBreakTime,
                totalLongBreakTime: userStats.totalLongBreakTime
            });
        }

        console.log("Migración completada exitosamente");
        process.exit(0);
    } catch (error) {
        console.error("Error en la migración:", error);
        process.exit(1);
    }
}

fixUserStats(); 