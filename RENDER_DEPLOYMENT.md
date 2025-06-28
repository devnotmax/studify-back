# Guía de Despliegue en Render

## Configuración de Variables de Entorno

En Render, necesitas configurar las siguientes variables de entorno:

### Variables Obligatorias:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render asigna automáticamente)
- `DATABASE_URL`: URL de tu base de datos PostgreSQL

### Variables Opcionales:
- `JWT_SECRET`: Tu clave secreta para JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del token (ej: `24h`)
- `origin`: URL de tu frontend

## Configuración de Base de Datos

### Opción 1: Base de Datos PostgreSQL de Render
1. Crea una nueva base de datos PostgreSQL en Render
2. Copia la URL de conexión interna
3. Configúrala como `DATABASE_URL`

### Opción 2: Base de Datos Externa
Si usas una base de datos externa (como Supabase, Railway, etc.):
- Asegúrate de que la URL incluya `?sslmode=require`
- Ejemplo: `postgresql://user:pass@host:5432/db?sslmode=require`

## Pasos para el Despliegue

1. **Conecta tu repositorio** a Render
2. **Configura las variables de entorno** en el dashboard de Render
3. **Especifica los comandos de build y start**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. **Configura el health check** en `/health`

## Solución de Problemas

### Error ENETUNREACH
Si ves este error, verifica:
- La `DATABASE_URL` está configurada correctamente
- La base de datos está accesible desde Render
- El SSL está configurado correctamente

### Error de Conexión a Base de Datos
- Verifica que la base de datos esté activa
- Confirma que las credenciales sean correctas
- Asegúrate de que la URL incluya los parámetros SSL necesarios

## Logs y Debugging

Los logs de la aplicación incluyen información de debug:
- `[DEBUG] Iniciando conexión a la base de datos...`
- `[DEBUG] NODE_ENV: production`
- `[DEBUG] DATABASE_URL exists: true/false`

Revisa estos logs en el dashboard de Render para diagnosticar problemas. 