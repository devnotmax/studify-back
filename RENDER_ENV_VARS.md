# Variables de Entorno para Render

## Configura estas variables en el dashboard de Render:

### Variables Obligatorias:
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres?sslmode=require
```

### Variables Opcionales (Recomendadas):
```
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=24h
origin=https://tu-frontend-url.com
```

## ⚠️ IMPORTANTE:

**La URL de Supabase debe incluir `?sslmode=require` al final:**

❌ **Incorrecto:**
```
postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres
```

✅ **Correcto:**
```
postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres?sslmode=require
```

## Pasos en Render:

1. Ve a tu servicio en Render
2. Haz clic en "Environment"
3. Agrega cada variable con su valor
4. Guarda los cambios
5. Haz redeploy

## Verificación:

Después de configurar las variables, deberías ver en los logs:
```
[DEBUG] NODE_ENV: production
[DEBUG] DATABASE_URL exists: true
[DEBUG] Conexión a la base de datos establecida exitosamente
``` 