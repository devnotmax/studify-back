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

async function checkAnitaSessions() {
  try {
    console.log("🔍 Verificando sesiones específicas de Anita...");
    
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos establecida");
    
    // ID de Anita
    const anitaId = "7c0d5c00-6685-44b2-9934-a764d44dbe18";
    const maximId = "c2f78f9f-4f61-4eea-aa00-2cd49e61f359";
    
    // Verificar sesiones de Anita
    const anitaSessions = await AppDataSource.query(`
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
        u.email,
        u."firstName",
        u."lastName"
      FROM sessions s
      LEFT JOIN users u ON s."userId" = u.id
      WHERE s."userId" = $1
      ORDER BY s."startTime" DESC
    `, [anitaId]);
    
    console.log(`\n👤 Sesiones de Anita (${anitaId}):`);
    console.log(`📊 Total: ${anitaSessions.length}`);
    
    if (anitaSessions.length > 0) {
      anitaSessions.forEach((session, index) => {
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
    } else {
      console.log("   ❌ Anita no tiene sesiones registradas");
    }
    
    // Verificar sesiones de Maxim
    const maximSessions = await AppDataSource.query(`
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
        u.email,
        u."firstName",
        u."lastName"
      FROM sessions s
      LEFT JOIN users u ON s."userId" = u.id
      WHERE s."userId" = $1
      ORDER BY s."startTime" DESC
      LIMIT 5
    `, [maximId]);
    
    console.log(`\n👤 Últimas 5 sesiones de Maxim (${maximId}):`);
    console.log(`📊 Total: ${maximSessions.length}`);
    
    maximSessions.forEach((session, index) => {
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
    
    // Verificar si hay sesiones recientes que podrían ser de Anita
    const recentSessions = await AppDataSource.query(`
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
        u.email,
        u."firstName",
        u."lastName"
      FROM sessions s
      LEFT JOIN users u ON s."userId" = u.id
      WHERE s."startTime" > NOW() - INTERVAL '24 hours'
      ORDER BY s."startTime" DESC
    `);
    
    console.log(`\n🕐 Sesiones de las últimas 24 horas:`);
    console.log(`📊 Total: ${recentSessions.length}`);
    
    recentSessions.forEach((session, index) => {
      const status = session.isCompleted ? "✅ Completada" : 
                    session.isCancelled ? "❌ Cancelada" : 
                    "🔄 Activa";
      
      console.log(`   ${index + 1}. ${session.email} - ${session.sessionType} - ${status}`);
      console.log(`      📅 Inicio: ${new Date(session.startTime).toLocaleString()}`);
      console.log(`      🆔 Usuario ID: ${session.userId}`);
    });
    
    // Verificar si hay sesiones sin usuario asociado
    const orphanSessions = await AppDataSource.query(`
      SELECT 
        s.id,
        s."sessionType",
        s.duration,
        s."completedTime",
        s."startTime",
        s."endTime",
        s."userId",
        s."isCompleted",
        s."isCancelled"
      FROM sessions s
      LEFT JOIN users u ON s."userId" = u.id
      WHERE u.id IS NULL
      ORDER BY s."startTime" DESC
    `);
    
    if (orphanSessions.length > 0) {
      console.log(`\n⚠️  ALERTA: Sesiones huérfanas (sin usuario asociado):`);
      console.log(`📊 Total: ${orphanSessions.length}`);
      
      orphanSessions.forEach((session, index) => {
        console.log(`   ${index + 1}. Sesión ID: ${session.id} - Usuario ID: ${session.userId}`);
        console.log(`      📅 Inicio: ${new Date(session.startTime).toLocaleString()}`);
        console.log(`      🎯 Tipo: ${session.sessionType}`);
      });
    } else {
      console.log(`\n✅ No se encontraron sesiones huérfanas`);
    }
    
  } catch (error) {
    console.error("❌ Error durante la verificación:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Ejecutar la verificación
checkAnitaSessions(); 