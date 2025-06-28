# Solución al Error ENETUNREACH en Render

## Problema
```
Error connecting to PostgreSQL: Error: connect ENETUNREACH 2600:1f16:1cd0:330d:fdb4:7f0e:24d6:d59:5432
```

## Causa del Error
El error `ENETUNREACH` indica que la aplicación no puede alcanzar la dirección IPv6 de la base de datos PostgreSQL. Esto suele ocurrir por:

1. **Configuración incorrecta de SSL**
2. **URL de base de datos mal formada**
3. **Variables de entorno no configuradas**
4. **Base de datos no accesible desde Render**

## Solución Paso a Paso

### 1. Verificar Variables de Entorno en Render

En el dashboard de Render, ve a tu servicio y configura estas variables:

```
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```

### 2. Configurar Base de Datos PostgreSQL

#### Opción A: Base de Datos de Render
1. Crea una nueva base de datos PostgreSQL en Render
2. Usa la URL de conexión interna que te proporciona Render
3. La URL debe verse así: `postgresql://user:pass@host:5432/dbname`

#### Opción B: Base de Datos Externa (Supabase, Railway, etc.)
- Asegúrate de que la URL incluya `?sslmode=require`
- Ejemplo: `postgresql://user:pass@host:5432/dbname?sslmode=require`

### 3. Verificar la Configuración

Ejecuta el script de verificación:
```bash
npm run check-env
```

### 4. Comandos de Build y Start en Render

En la configuración de tu servicio en Render:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

### 5. Health Check

La aplicación ahora incluye un endpoint de health check en `/health` que Render puede usar para verificar que la aplicación está funcionando.

## Cambios Realizados

### 1. Configuración Mejorada de Base de Datos
- ✅ Configuración específica para Render en `src/app/config/database/render-config.ts`
- ✅ Manejo mejorado de SSL
- ✅ Timeouts más largos para conexiones
- ✅ Validación de configuración antes de conectar

### 2. Manejo de Errores Mejorado
- ✅ La aplicación no falla completamente si no puede conectar a la BD
- ✅ Logs detallados para debugging
- ✅ Manejo de señales de terminación

### 3. Health Check
- ✅ Endpoint `/health` para verificar el estado de la aplicación
- ✅ Información útil sobre el estado del servidor

### 4. Scripts de Verificación
- ✅ Script `check-env` para verificar variables de entorno
- ✅ Validación automática antes del build

## Verificación

Después de aplicar estos cambios:

1. **Haz commit y push** de los cambios
2. **Verifica las variables de entorno** en Render
3. **Revisa los logs** en el dashboard de Render
4. **Prueba el health check** en `https://tu-app.onrender.com/health`

## Logs Esperados

Si todo está configurado correctamente, deberías ver:
```
[DEBUG] Iniciando aplicación...
[DEBUG] NODE_ENV: production
[DEBUG] DATABASE_URL exists: true
[DEBUG] Conexión a la base de datos establecida exitosamente
[DEBUG] Rutas configuradas.
[DEBUG] Servidor escuchando en puerto: 10000
[INFO] Health check disponible en: http://localhost:10000/health
```

## Si el Problema Persiste

1. **Verifica la URL de la base de datos** - debe incluir `sslmode=require`
2. **Confirma que la base de datos esté activa** y accesible
3. **Revisa los logs completos** en Render para más detalles
4. **Prueba la conexión localmente** con la misma URL 