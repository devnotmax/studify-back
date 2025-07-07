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

async function checkUsers() {
  try {
    console.log("🔍 Verificando usuarios en la base de datos...");
    
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos establecida");
    
    // Obtener todos los usuarios
    const users = await AppDataSource.query(`
      SELECT 
        u.id,
        u.email,
        u."firstName",
        u."lastName",
        u."birthDate",
        u.role,
        u."createdAt",
        u."updatedAt",
        COUNT(s.id) as session_count
      FROM users u
      LEFT JOIN sessions s ON u.id = s."userId"
      GROUP BY u.id, u.email, u."firstName", u."lastName", u."birthDate", u.role, u."createdAt", u."updatedAt"
      ORDER BY u."createdAt" DESC
    `);
    
    console.log(`\n📊 Total de usuarios encontrados: ${users.length}`);
    
    if (users.length === 0) {
      console.log("❌ No se encontraron usuarios en la base de datos");
      return;
    }
    
    console.log("\n👥 Lista de usuarios:");
    console.log("=" .repeat(100));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. 👤 Usuario: ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   👑 Rol: ${user.role}`);
      console.log(`   📅 Fecha de nacimiento: ${new Date(user.birthDate).toLocaleDateString()}`);
      console.log(`   📈 Total de sesiones: ${user.session_count}`);
      console.log(`   🕐 Creado: ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`   🔄 Actualizado: ${new Date(user.updatedAt).toLocaleString()}`);
    });
    
    // Verificar si hay usuarios duplicados por email
    const emailCounts = {};
    users.forEach(user => {
      emailCounts[user.email] = (emailCounts[user.email] || 0) + 1;
    });
    
    const duplicateEmails = Object.keys(emailCounts).filter(email => emailCounts[email] > 1);
    
    if (duplicateEmails.length > 0) {
      console.log("\n⚠️  ALERTA: Emails duplicados encontrados:");
      console.log("=" .repeat(100));
      duplicateEmails.forEach(email => {
        console.log(`   🚨 Email: ${email} - ${emailCounts[email]} usuarios`);
      });
    } else {
      console.log("\n✅ No se encontraron emails duplicados");
    }
    
    // Verificar usuarios recientes (últimas 24 horas)
    const recentUsers = users.filter(user => {
      const userDate = new Date(user.createdAt);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return userDate > yesterday;
    });
    
    console.log(`\n🕐 Usuarios creados en las últimas 24 horas: ${recentUsers.length}`);
    if (recentUsers.length > 0) {
      recentUsers.forEach(user => {
        console.log(`   📅 ${user.email}: ${new Date(user.createdAt).toLocaleString()}`);
      });
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
checkUsers(); 