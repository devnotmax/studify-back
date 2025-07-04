const { AppDataSource } = require("../dist/app/config/database/connection");
const { UserStats } = require("../dist/models/user-stats.model");

async function resetUserStats() {
    try {
        await AppDataSource.initialize();
        console.log("Base de datos conectada");

        const userStatsRepository = AppDataSource.getRepository(UserStats);

        // Obtener todas las estadísticas de usuarios
        const allUserStats = await userStatsRepository.find({
            relations: ["user"]
        });

        console.log(`Encontradas ${allUserStats.length} estadísticas de usuarios para resetear`);

        for (const userStats of allUserStats) {
            // Resetear a valores iniciales
            userStats.currentStreak = 0;
            userStats.longestStreak = 0;
            userStats.lastActivityDate = null;
            userStats.totalSessions = 0;
            userStats.totalTime = 0;
            userStats.averageSessionDuration = 0;
            userStats.longestSession = 0;
            userStats.longestSessionDate = new Date();
            userStats.totalFocusTime = 0;
            userStats.totalBreakTime = 0;
            userStats.totalLongBreakTime = 0;

            await userStatsRepository.save(userStats);

            console.log(`Estadísticas reseteadas para usuario: ${userStats.user.id}`);
        }

        console.log("✅ Reset completado exitosamente");
        console.log(`📊 ${allUserStats.length} usuarios reseteados a 0`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error en el reset:", error);
        process.exit(1);
    }
}

resetUserStats(); 