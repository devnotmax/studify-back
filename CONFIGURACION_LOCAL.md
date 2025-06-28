# Configuración Local para Desarrollo

## Problema
La aplicación no puede conectarse a la base de datos porque no tienes las variables de entorno configuradas localmente.

## Solución

### 1. Crear archivo `.env` en la raíz del proyecto

Crea un archivo llamado `.env` en la raíz de tu proyecto con este contenido:

```env
# Configuración del servidor
NODE_ENV=development
PORT=3000

# Base de datos PostgreSQL (Supabase)
DATABASE_URL=postgresql://postgres:notevagustar23@db.foyauucqfyjwceybcfud.supabase.co:5432/postgres?sslmode=require

# JWT
JWT_SECRET=mi_clave_secreta_super_segura_2024
JWT_EXPIRES_IN=24h

# CORS
origin=http://localhost:5173
```

### 2. Verificar la configuración

Ejecuta estos comandos para verificar que todo esté configurado correctamente:

```bash
# Verificar variables de entorno
npm run check-env

# Verificar URL de Supabase
npm run check-supabase

# Diagnóstico completo
npm run diagnose-db
```

### 3. Probar la aplicación localmente

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### 4. Probar endpoints

Una vez que la aplicación esté corriendo, puedes probar:

```bash
# Health check
curl http://localhost:3000/health

# Estado de la base de datos
curl http://localhost:3000/api/db-status

# Login (reemplaza con tus credenciales)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"develop.maxsj@gmail.com","password":"notevagustar23"}'
```

## Variables de Entorno Explicadas

- **NODE_ENV**: `development` para desarrollo local, `production` para Render
- **PORT**: Puerto donde correrá la aplicación (3000 para desarrollo)
- **DATABASE_URL**: URL de conexión a Supabase (debe incluir `?sslmode=require`)
- **JWT_SECRET**: Clave secreta para firmar tokens JWT
- **JWT_EXPIRES_IN**: Tiempo de expiración de los tokens
- **origin**: URL del frontend para CORS

## Importante

- **Nunca subas el archivo `.env` a Git** (ya está en .gitignore)
- **La URL de Supabase debe incluir `?sslmode=require`** para funcionar correctamente
- **En Render, usa `NODE_ENV=production`**

## Troubleshooting

Si sigues teniendo problemas:

1. **Verifica que el archivo `.env` esté en la raíz del proyecto**
2. **Asegúrate de que la URL de Supabase incluya SSL**
3. **Confirma que las credenciales de Supabase sean correctas**
4. **Verifica que la base de datos esté activa en Supabase** 