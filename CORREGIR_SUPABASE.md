# Corregir URL de Supabase en Render

## Problema Actual
```
Error connecting to PostgreSQL: Error: connect ENETUNREACH 2600:1f16:1cd0:330d:fdb4:7f0e:24d6:d59:5432
```

## Causa
La URL de Supabase no incluye el parámetro SSL requerido para conexiones desde Render.

## Solución

### 1. URL Actual (Incorrecta)
```
postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres
```

### 2. URL Corregida (Correcta)
```
postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres?sslmode=require
```

## Pasos para Corregir en Render

1. **Ve a tu servicio en Render**
2. **Haz clic en "Environment"**
3. **Encuentra la variable `DATABASE_URL`**
4. **Actualiza el valor** agregando `?sslmode=require` al final
5. **Guarda los cambios**
6. **Haz redeploy**

## Verificación

Después de corregir la URL, deberías ver en los logs:
```
[DEBUG] Conexión a la base de datos establecida exitosamente
```

En lugar de:
```
[WARNING] No se pudo conectar a la base de datos
```

## Health Check

El endpoint `/health` ahora está disponible en la raíz y debería responder correctamente.

## Variables de Entorno Completas para Render

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=24h
```

## ¿Por qué es necesario `?sslmode=require`?

Supabase requiere conexiones SSL en producción, y Render necesita que especifiques explícitamente que quieres usar SSL. Sin este parámetro, la conexión falla con `ENETUNREACH`. 