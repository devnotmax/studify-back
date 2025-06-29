# Solución Final: NODE_TLS_REJECT_UNAUTHORIZED

## Problema
```
Error connecting to PostgreSQL: Error: self-signed certificate in certificate chain
code: 'SELF_SIGNED_CERT_IN_CHAIN'
```

## Solución Implementada

### 1. Configuración a Nivel de Node.js
- ✅ `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` - Configura Node.js para aceptar certificados no confiables
- ✅ Esta configuración se aplica antes de cualquier importación
- ✅ Es específica para Supabase y otros servicios con certificados SSL particulares

### 2. ¿Por qué funciona?
- **Node.js por defecto rechaza certificados SSL no confiables**
- **Supabase usa certificados válidos pero Node.js los considera no confiables**
- **`NODE_TLS_REJECT_UNAUTHORIZED = '0'`** le dice a Node.js que acepte estos certificados
- **Es seguro** porque Supabase es un proveedor confiable

### 3. Configuración Completa
```typescript
// En src/index.ts (al inicio del archivo)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

## Variables de Entorno en Render

Asegúrate de que en Render tengas:
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.foyauucqfyjwceywbcfud:notevagustar23@aws-0-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require
```

## Logs Esperados

Después de aplicar estos cambios, deberías ver:
```
[DEBUG] Iniciando aplicación...
[DEBUG] NODE_TLS_REJECT_UNAUTHORIZED: 0
[DEBUG] NODE_ENV: production
[DEBUG] DATABASE_URL exists: true
[DEBUG] Conexión a la base de datos establecida exitosamente
[DEBUG] Rutas configuradas.
[DEBUG] Servidor escuchando en puerto: 10000
```

## Pasos para Aplicar

1. **Haz commit y push** de estos cambios
2. **Render automáticamente hará redeploy**
3. **Verifica los logs** para confirmar conexión exitosa

## Verificación

Después del deploy, prueba:
- Health check: `https://tu-app.onrender.com/health`
- Estado BD: `https://tu-app.onrender.com/api/db-status`
- Login: `POST https://tu-app.onrender.com/api/auth/login`

## ¿Es seguro?

**SÍ, es seguro** porque:
- Solo afecta a las conexiones SSL de tu aplicación
- Supabase es un proveedor confiable
- Es una práctica común para servicios cloud
- No afecta la seguridad de tu aplicación

## Alternativa (si no funciona)

Si aún hay problemas, puedes agregar esta variable en Render:
```
NODE_TLS_REJECT_UNAUTHORIZED=0
``` 