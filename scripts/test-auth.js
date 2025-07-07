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

async function testAuth() {
  try {
    console.log("🔐 Probando autenticación...");
    
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos establecida");
    
    // Obtener usuarios
    const users = await AppDataSource.query(`
      SELECT id, email, "firstName", "lastName"
      FROM users
      ORDER BY "createdAt" DESC
    `);
    
    console.log(`\n👥 Usuarios encontrados: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. 👤 ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      
      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      console.log(`   🔑 Token JWT:`);
      console.log(`      ${token}`);
      
      // Decodificar token para verificar
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log(`   ✅ Token válido para: ${decoded.email} (ID: ${decoded.id})`);
    });
    
    // Probar autenticación con tokens
    console.log(`\n🧪 Probando autenticación con tokens...`);
    
    for (const user of users) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Simular request con token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Verificar sesiones del usuario
      const sessions = await AppDataSource.query(`
        SELECT COUNT(*) as count
        FROM sessions
        WHERE "userId" = $1
      `, [decoded.id]);
      
      console.log(`\n🔍 Usuario: ${user.email}`);
      console.log(`   🆔 ID del token: ${decoded.id}`);
      console.log(`   📊 Sesiones: ${sessions[0].count}`);
      console.log(`   ✅ Autenticación: ${decoded.id === user.id ? 'CORRECTA' : 'INCORRECTA'}`);
    }
    
    // Verificar configuración JWT
    console.log(`\n⚙️  Configuración JWT:`);
    console.log(`   🔑 JWT_SECRET existe: ${!!process.env.JWT_SECRET}`);
    console.log(`   🔑 JWT_SECRET length: ${process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0}`);
    
  } catch (error) {
    console.error("❌ Error durante la prueba:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Ejecutar la prueba
testAuth(); 