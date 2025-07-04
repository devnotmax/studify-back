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

            // Calcular racha
            let currentStreak = 0;
            let longestStreak = 0;
            let lastActivityDate = null;
            let consecutiveDays = 0;

            for (const session of completedSessions) {
                const sessionDate = startOfDay(session.endTime);
                
                if (!lastActivityDate) {
                    // Primera sesión
                    consecutiveDays = 1;
                    currentStreak = 1;
                    longestStreak = 1;
                } else {
                    const lastDate = startOfDay(lastActivityDate);
                    
                    if (isSameDay(sessionDate, lastDate)) {
                        // Mismo día, mantener racha
                        // No hacer nada
                    } else if (isSameDay(sessionDate, addDays(lastDate, 1))) {
                        // Día consecutivo, incrementar racha
                        consecutiveDays++;
                        currentStreak = consecutiveDays;
                        longestStreak = Math.max(longestStreak, consecutiveDays);
                    } else {
                        // Día no consecutivo, reiniciar racha
                        consecutiveDays = 1;
                        currentStreak = 1;
                    }
                }
                
                lastActivityDate = sessionDate;
            }

            // Actualizar estadísticas
            userStats.currentStreak = currentStreak;
            userStats.longestStreak = longestStreak;
            userStats.lastActivityDate = lastActivityDate;
            userStats.totalSessions = completedSessions.length;
            userStats.totalTime = completedSessions.reduce((acc, session) => acc + session.completedTime, 0);
            userStats.totalFocusTime = completedSessions.reduce((acc, session) => acc + session.completedTime, 0);

            await userStatsRepository.save(userStats);

            console.log(`Usuario ${userStats.user.id} actualizado:`, {
                currentStreak,
                longestStreak,
                totalSessions: completedSessions.length,
                lastActivityDate
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