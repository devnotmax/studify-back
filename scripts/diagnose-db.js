#!/usr/bin/env node

// Cargar variables de entorno
require('dotenv').config();

console.log('🔍 Diagnóstico completo de la base de datos...\n');

// 1. Verificar variables de entorno
console.log('📋 1. Variables de entorno:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'NO CONFIGURADA'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'CONFIGURADA' : 'NO CONFIGURADA'}`);

if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    console.log(`URL: ${dbUrl.substring(0, 50)}...`);
    
    // Verificar si es Supabase
    if (dbUrl.includes('supabase.co') || dbUrl.includes('supabase.com')) {
        console.log('✅ Es una URL de Supabase');
        
        // Verificar SSL
        if (dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=true')) {
            console.log('✅ SSL configurado correctamente');
        } else {
            console.log('❌ SSL NO configurado - ESTE ES EL PROBLEMA');
            console.log('💡 URL corregida:');
            console.log(dbUrl + '?sslmode=require');
        }
    } else {
        console.log('ℹ️  No es una URL de Supabase');
    }
}

console.log('\n📋 2. Verificando configuración de TypeORM...');

// 2. Verificar configuración de TypeORM
try {
    const { AppDataSource } = require('../src/app/config/database/connection');
    console.log('✅ AppDataSource importado correctamente');
    console.log(`Estado de inicialización: ${AppDataSource.isInitialized ? 'Inicializado' : 'No inicializado'}`);
} catch (error) {
    console.log('❌ Error importando AppDataSource:', error.message);
}

console.log('\n📋 3. Verificando entidades...');

// 3. Verificar entidades
try {
    const { User } = require('../src/models/user.model');
    console.log('✅ Entidad User importada correctamente');
} catch (error) {
    console.log('❌ Error importando entidad User:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('🎯 Resumen del diagnóstico:');

if (!process.env.DATABASE_URL) {
    console.log('❌ PROBLEMA PRINCIPAL: DATABASE_URL no configurada');
    console.log('💡 SOLUCIÓN: Configura la variable de entorno');
    console.log('   Ejemplo: DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require');
} else if (!process.env.DATABASE_URL.includes('sslmode=require')) {
    console.log('❌ PROBLEMA PRINCIPAL: URL sin SSL');
    console.log('💡 SOLUCIÓN: Agrega ?sslmode=require al final de la URL');
    console.log('   URL actual:', process.env.DATABASE_URL);
    console.log('   URL corregida:', process.env.DATABASE_URL + '?sslmode=require');
} else {
    console.log('✅ Configuración parece correcta');
    console.log('💡 Si aún hay problemas, verifica:');
    console.log('   1. Que la base de datos esté activa en Supabase');
    console.log('   2. Que las credenciales sean correctas');
    console.log('   3. Que la IP de Render esté permitida en Supabase');
} 