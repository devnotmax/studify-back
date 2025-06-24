# Configuración de Variables de Entorno

## Variables de Entorno Necesarias

### Para Desarrollo Local (.env)
```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de CORS (opcional en desarrollo)
# Se usan los orígenes de localhost por defecto
ORIGIN=

# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pomodoro_db
DB_USER=postgres
DB_PASSWORD=password

# Configuración JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Para Producción (Render, Railway, etc.)

#### Opción 1: Permitir Todos los Orígenes (Menos Seguro)
```env
NODE_ENV=production
ORIGIN=*
```

#### Opción 2: Dominios Específicos (Más Seguro - Recomendado)
```env
NODE_ENV=production
ORIGIN=https://tuapp.com,https://www.tuapp.com,https://admin.tuapp.com
```

#### Opción 3: Sin Configurar (Usa '*' por defecto)
```env
NODE_ENV=production
# ORIGIN no configurado = permite todos los orígenes
```

## Configuración por Plataforma

### Render
1. Ve a tu proyecto en Render
2. Dashboard → Environment Variables
3. Agrega las variables:
   - `NODE_ENV`: `production`
   - `ORIGIN`: `https://tuapp.com,https://www.tuapp.com` (tus dominios)

### Railway
1. Ve a tu proyecto en Railway
2. Variables → Add Variable
3. Agrega las variables:
   - `NODE_ENV`: `production`
   - `ORIGIN`: `https://tuapp.com,https://www.tuapp.com` (tus dominios)

### Heroku
```bash
heroku config:set NODE_ENV=production
heroku config:set ORIGIN=https://tuapp.com,https://www.tuapp.com
```

### Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables:
   - `NODE_ENV`: `production`
   - `ORIGIN`: `https://tuapp.com,https://www.tuapp.com` (tus dominios)

## Comportamiento de CORS

### En Desarrollo (NODE_ENV=development)
- Permite automáticamente: `localhost:3000`, `localhost:3001`, `localhost:5173`, etc.
- No necesitas configurar `ORIGIN`

### En Producción (NODE_ENV=production)
- **Si `ORIGIN` no está configurado**: Permite todos los orígenes (`*`)
- **Si `ORIGIN` está configurado**: Solo permite los dominios especificados
- **Si `ORIGIN=*`**: Permite todos los orígenes

## Ejemplos de Configuración

### Frontend en Vercel, Backend en Render
```env
# En Render (Backend)
NODE_ENV=production
ORIGIN=https://tuapp.vercel.app,https://www.tuapp.vercel.app
```

### Frontend en Netlify, Backend en Railway
```env
# En Railway (Backend)
NODE_ENV=production
ORIGIN=https://tuapp.netlify.app,https://www.tuapp.netlify.app
```

### Aplicación Móvil + Web
```env
# Si tienes app móvil que hace requests sin origin
NODE_ENV=production
ORIGIN=https://tuapp.com,https://www.tuapp.com
# Las apps móviles funcionarán porque no tienen origin
```

## Seguridad

### Recomendaciones
1. **En producción**: Especifica solo los dominios que necesitas
2. **Cambia JWT_SECRET**: Usa una clave fuerte y única
3. **Usa HTTPS**: Siempre en producción
4. **Revisa logs**: Monitorea los orígenes bloqueados

### Configuración Muy Segura
```env
NODE_ENV=production
ORIGIN=https://tuapp.com,https://www.tuapp.com,https://admin.tuapp.com
JWT_SECRET=tu-clave-super-secreta-de-64-caracteres-minimo
```

### Configuración Menos Segura (Solo para pruebas)
```env
NODE_ENV=production
ORIGIN=*
JWT_SECRET=test-key
```

## Troubleshooting

### Error: "Not allowed by CORS"
1. Verifica que el dominio del frontend esté en `ORIGIN`
2. Revisa los logs del servidor para ver qué origen está siendo bloqueado
3. Asegúrate de que `NODE_ENV` esté configurado correctamente

### Error: "Network Error"
1. Verifica que el backend esté desplegado y funcionando
2. Asegúrate de que la URL del backend sea correcta
3. Revisa que no haya problemas de red

### Error: "Invalid credentials"
1. Verifica que las credenciales sean correctas
2. Asegúrate de que el usuario esté registrado
3. Revisa que el formato del email sea válido 