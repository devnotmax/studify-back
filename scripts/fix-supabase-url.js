#!/usr/bin/env node

console.log('🔧 Verificando URL de Supabase...\n');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.log('❌ DATABASE_URL no está configurada');
    process.exit(1);
}

console.log('📋 URL actual:', dbUrl);

// Verificar si es una URL de Supabase
if (dbUrl.includes('supabase.co')) {
    console.log('✅ Es una URL de Supabase');
    
    // Verificar si tiene SSL
    if (dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=true')) {
        console.log('✅ SSL configurado correctamente');
    } else {
        console.log('⚠️  SSL no configurado');
        console.log('💡 URL corregida:');
        console.log(dbUrl + '?sslmode=require');
        console.log('\n🔧 Para corregir en Render:');
        console.log('1. Ve a tu servicio en Render');
        console.log('2. Environment Variables');
        console.log('3. Actualiza DATABASE_URL con:');
        console.log(dbUrl + '?sslmode=require');
    }
} else {
    console.log('ℹ️  No es una URL de Supabase');
}

// Verificar formato de la URL
const urlPattern = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+(\?.*)?$/;
if (urlPattern.test(dbUrl)) {
    console.log('✅ Formato de URL correcto');
} else {
    console.log('❌ Formato de URL incorrecto');
}

console.log('\n' + '='.repeat(50)); 