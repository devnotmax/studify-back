const { DataSource } = require("typeorm");
require("dotenv").config();

// Configuración de la base de datos
const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/models/**/*.js"],
  synchronize: false,
  logging: false
});

async function diagnoseSessions() {
  try {
    console.log("🔍 Iniciando diagnóstico de sesiones...");
    
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos establecida");
    
    // Obtener todas las sesiones con información del usuario
    const sessions = await AppDataSource.query(`
      SELECT 
        s.id,
        s."sessionType",
        s.duration,
        s."completedTime",
        s."startTime",
        s."endTime",
        s."userId",
        s."isCompleted",
        s."isCancelled",
        s."isPaused",
        s."isResumed",
        u.email,
        u."firstName",
        u."lastName"
      FROM sessions s
      LEFT JOIN users u ON s."userId" = u.id
      ORDER BY s."startTime" DESC
      LIMIT 50
    `);
    
    console.log(`\n📊 Total de sesiones encontradas: ${sessions.length}`);
    
    if (sessions.length === 0) {
      console.log("❌ No se encontraron sesiones en la base de datos");
      return;
    }
    
    // Agrupar sesiones por usuario
    const sessionsByUser = {};
    sessions.forEach(session => {
      const userKey = `${session.email} (${session.userId})`;
      if (!sessionsByUser[userKey]) {
        sessionsByUser[userKey] = [];
      }
      sessionsByUser[userKey].push(session);
    });
    
    console.log("\n👥 Sesiones agrupadas por usuario:");
    console.log("=" .repeat(80));
    
    Object.keys(sessionsByUser).forEach(userKey => {
      const userSessions = sessionsByUser[userKey];
      console.log(`\n👤 Usuario: ${userKey}`);
      console.log(`   📈 Total de sesiones: ${userSessions.length}`);
      
      userSessions.forEach((session, index) => {
        const status = session.isCompleted ? "✅ Completada" : 
                      session.isCancelled ? "❌ Cancelada" : 
                      "🔄 Activa";
        
        console.log(`   ${index + 1}. ${session.sessionType} - ${session.duration}s - ${status}`);
        console.log(`      📅 Inicio: ${new Date(session.startTime).toLocaleString()}`);
        if (session.endTime) {
          console.log(`      🏁 Fin: ${new Date(session.endTime).toLocaleString()}`);
        }
        console.log(`      ⏱️ Completado: ${session.completedTime}s / ${session.duration}s`);
      });
    });
    
    // Verificar si hay sesiones sin usuario asociado
    const orphanSessions = sessions.filter(s => !s.email);
    if (orphanSessions.length > 0) {
      console.log("\n⚠️  ALERTA: Sesiones huérfanas (sin usuario asociado):");
      console.log("=" .repeat(80));
      orphanSessions.forEach(session => {
        console.log(`   🚨 Sesión ID: ${session.id} - Usuario ID: ${session.userId} - Tipo: ${session.sessionType}`);
      });
    }
    
    // Verificar sesiones recientes (últimas 24 horas)
    const recentSessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return sessionDate > yesterday;
    });
    
    console.log(`\n🕐 Sesiones de las últimas 24 horas: ${recentSessions.length}`);
    if (recentSessions.length > 0) {
      recentSessions.forEach(session => {
        const userKey = `${session.email} (${session.userId})`;
        console.log(`   📅 ${userKey}: ${session.sessionType} - ${new Date(session.startTime).toLocaleString()}`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error durante el diagnóstico:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Ejecutar el diagnóstico
diagnoseSessions(); 