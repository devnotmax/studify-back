#!/bin/bash

echo "🚀 Iniciando build en Render..."

# Instalar todas las dependencias (incluyendo devDependencies para el build)
echo "📦 Instalando dependencias..."
npm install

# Verificar variables de entorno
echo "🔍 Verificando configuración..."
npm run check-env

# Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build

echo "✅ Build completado exitosamente!" 