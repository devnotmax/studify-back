#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando variables de entorno...\n');

const envContent = `# Configuración del servidor
NODE_ENV=development
PORT=3000

# Base de datos PostgreSQL (Supabase)
DATABASE_URL=postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres?sslmode=require

# JWT
JWT_SECRET=mi_clave_secreta_super_segura_2024
JWT_EXPIRES_IN=24h

# CORS
origin=http://localhost:5173
`;

const envPath = path.join(__dirname, '..', '.env');

try {
    // Verificar si el archivo ya existe
    if (fs.existsSync(envPath)) {
        console.log('⚠️  El archivo .env ya existe');
        console.log('💡 Si quieres sobrescribirlo, elimínalo manualmente y ejecuta este script nuevamente');
        return;
    }

    // Crear el archivo .env
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env creado exitosamente');
    console.log('📁 Ubicación:', envPath);
    
    console.log('\n📋 Variables configuradas:');
    console.log('✅ NODE_ENV=development');
    console.log('✅ PORT=3000');
    console.log('✅ DATABASE_URL (con SSL)');
    console.log('✅ JWT_SECRET');
    console.log('✅ JWT_EXPIRES_IN=24h');
    console.log('✅ origin=http://localhost:5173');
    
    console.log('\n🚀 Próximos pasos:');
    console.log('1. Ejecuta: npm run diagnose-db');
    console.log('2. Ejecuta: npm run dev');
    console.log('3. Prueba: http://localhost:3000/health');
    
} catch (error) {
    console.error('❌ Error creando archivo .env:', error.message);
    console.log('\n💡 Crea manualmente el archivo .env con este contenido:');
    console.log(envContent);
} 