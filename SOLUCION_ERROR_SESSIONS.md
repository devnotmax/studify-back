# Solución al Error de Sessions - endTime NOT NULL

## Problema
```
Error: 23502 - Failing row contains (..., null, ...)
column: endTime
```

## Causa
La tabla `sessions` en la base de datos tiene una restricción que no permite valores `NULL` en la columna `endTime`, pero cuando se inicia una sesión, `endTime` debe ser `NULL` hasta que la sesión termine.

## Solución

### 1. Corregir el Modelo (Ya hecho)
```typescript
// En src/models/session.model.ts
@Column({ nullable: true })
endTime!: Date | null;
```

### 2. Ejecutar Migración en Supabase

Ve a tu dashboard de Supabase y ejecuta este SQL en el SQL Editor:

```sql
-- Hacer la columna endTime nullable
ALTER TABLE sessions ALTER COLUMN "endTime" DROP NOT NULL;

-- Establecer valores por defecto
ALTER TABLE sessions ALTER COLUMN "completedTime" SET DEFAULT 0;
ALTER TABLE sessions ALTER COLUMN "isCompleted" SET DEFAULT false;
ALTER TABLE sessions ALTER COLUMN "isCancelled" SET DEFAULT false;
ALTER TABLE sessions ALTER COLUMN "isPaused" SET DEFAULT false;
ALTER TABLE sessions ALTER COLUMN "isResumed" SET DEFAULT false;
```

### 3. Verificar la Estructura
```sql
-- Verificar que endTime sea nullable
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'sessions' AND column_name = 'endTime';
```

**Resultado esperado:**
```
column_name | data_type | is_nullable | column_default
------------|-----------|-------------|----------------
endTime     | timestamp | YES         | null
```

## Pasos para Aplicar

1. **Ejecuta el SQL** en Supabase SQL Editor
2. **Haz commit y push** de los cambios del modelo
3. **Render hará redeploy** automáticamente
4. **Prueba crear una sesión** nuevamente

## Verificación

Después de aplicar los cambios, deberías poder crear una sesión sin errores:

```json
POST /api/sessions
{
  "sessionType": "focus",
  "duration": 1500
}
```

**Respuesta esperada:**
```json
{
  "message": "Sesión iniciada correctamente",
  "session": {
    "id": "uuid",
    "sessionType": "focus",
    "duration": 1500,
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": null,
    "completedTime": 0,
    "isCompleted": false,
    "isCancelled": false
  }
}
```

## ¿Por qué ocurrió esto?

- **TypeORM** creó la tabla con restricciones por defecto
- **endTime** se definió como `NOT NULL` inicialmente
- **Al iniciar una sesión**, `endTime` debe ser `NULL`
- **Al finalizar una sesión**, `endTime` se establece con la fecha actual

## Prevención

Para evitar este problema en el futuro:
- Siempre usar `nullable: true` para campos que pueden ser `NULL`
- Usar `default: value` para campos con valores por defecto
- Probar las migraciones en un entorno de desarrollo primero 