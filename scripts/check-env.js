#!/usr/bin/env node

const requiredEnvVars = [
  'DATABASE_URL'
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'origin'
];

console.log('🔍 Verificando variables de entorno...\n');

let hasErrors = false;

// Verificar variables requeridas
console.log('📋 Variables requeridas:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName === 'DATABASE_URL' ? '[CONFIGURADA]' : value}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    hasErrors = true;
  }
});

console.log('\n📋 Variables opcionales:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName === 'JWT_SECRET' ? '[CONFIGURADA]' : value}`);
  } else {
    console.log(`⚠️  ${varName}: NO CONFIGURADA (opcional)`);
  }
});

console.log('\n🔧 Configuración del entorno:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`PORT: ${process.env.PORT || '3000'}`);

if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  const hasSSL = dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=true');
  console.log(`DATABASE_URL: ${hasSSL ? '✅ Con SSL' : '⚠️  Sin SSL (recomendado para producción)'}`);
  
  // Si es Supabase y no tiene SSL, mostrar advertencia
  if (dbUrl.includes('supabase.co') && !hasSSL) {
    console.log('💡 Para Supabase en producción, agrega ?sslmode=require al final de la URL');
  }
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ ERROR: Faltan variables de entorno requeridas');
  console.log('💡 Configura las variables faltantes en Render o en tu archivo .env');
  process.exit(1);
} else {
  console.log('✅ Todas las variables requeridas están configuradas');
  console.log('🚀 Listo para desplegar');
} 