const jwt = require("jsonwebtoken");
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

async function testEndpoints() {
  try {
    console.log("🌐 Probando endpoints de la API...");
    
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos establecida");
    
    // Obtener usuarios
    const users = await AppDataSource.query(`
      SELECT id, email, "firstName", "lastName"
      FROM users
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`\n👥 Probando endpoints para ${users.length} usuarios...`);
    
    for (const user of users) {
      console.log(`\n🔍 Probando usuario: ${user.email}`);
      
      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Simular request con token (simulando el middleware de auth)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Simular getSessionHistory
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
          u.email,
          u."firstName",
          u."lastName"
        FROM sessions s
        LEFT JOIN users u ON s."userId" = u.id
        WHERE s."userId" = $1
        ORDER BY s."startTime" DESC
        LIMIT 10
      `, [decoded.id]);
      
      console.log(`   📊 Sesiones encontradas: ${sessions.length}`);
      
      if (sessions.length > 0) {
        console.log(`   📋 Últimas sesiones:`);
        sessions.slice(0, 3).forEach((session, index) => {
          const status = session.isCompleted ? "✅ Completada" : 
                        session.isCancelled ? "❌ Cancelada" : 
                        "🔄 Activa";
          
          console.log(`      ${index + 1}. ${session.sessionType} - ${session.duration}s - ${status}`);
          console.log(`         📅 ${new Date(session.startTime).toLocaleString()}`);
          console.log(`         👤 Usuario: ${session.email}`);
        });
      } else {
        console.log(`   ❌ No hay sesiones para este usuario`);
      }
      
      // Verificar que todas las sesiones pertenecen al usuario correcto
      const wrongSessions = sessions.filter(s => s.userId !== decoded.id);
      if (wrongSessions.length > 0) {
        console.log(`   ⚠️  ALERTA: ${wrongSessions.length} sesiones no pertenecen a este usuario!`);
      } else {
        console.log(`   ✅ Todas las sesiones pertenecen al usuario correcto`);
      }
    }
    
    // Probar endpoint de sesión activa
    console.log(`\n🔄 Probando endpoint de sesión activa...`);
    
    for (const user of users) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const activeSession = await AppDataSource.query(`
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
          u.email
        FROM sessions s
        LEFT JOIN users u ON s."userId" = u.id
        WHERE s."userId" = $1 AND s."isCompleted" = false AND s."isCancelled" = false
        LIMIT 1
      `, [decoded.id]);
      
      console.log(`   👤 ${user.email}: ${activeSession.length > 0 ? 'Tiene sesión activa' : 'No tiene sesión activa'}`);
    }
    
    // Probar estadísticas
    console.log(`\n📈 Probando endpoint de estadísticas...`);
    
    for (const user of users) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const stats = await AppDataSource.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN s."isCompleted" = true AND s."isCancelled" = false THEN 1 END) as completed,
          COUNT(CASE WHEN s."isCancelled" = true THEN 1 END) as cancelled
        FROM sessions s
        WHERE s."userId" = $1
      `, [decoded.id]);
      
      console.log(`   👤 ${user.email}:`);
      console.log(`      📊 Total: ${stats[0].total}`);
      console.log(`      ✅ Completadas: ${stats[0].completed}`);
      console.log(`      ❌ Canceladas: ${stats[0].cancelled}`);
    }
    
  } catch (error) {
    console.error("❌ Error durante la prueba:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Ejecutar la prueba
testEndpoints(); 