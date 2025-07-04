-- Migración para corregir la columna endTime en la tabla sessions
-- Ejecutar este script en tu base de datos de Supabase

-- 1. Hacer la columna endTime nullable
ALTER TABLE sessions ALTER COLUMN "endTime" DROP NOT NULL;

-- 2. Establecer un valor por defecto para completedTime si no existe
ALTER TABLE sessions ALTER COLUMN "completedTime" SET DEFAULT 0;

-- 3. Verificar que las columnas booleanas tengan valores por defecto
ALTER TABLE sessions ALTER COLUMN "isCompleted" SET DEFAULT false;
ALTER TABLE sessions ALTER COLUMN "isCancelled" SET DEFAULT false;
ALTER TABLE sessions ALTER COLUMN "isPaused" SET DEFAULT false;
ALTER TABLE sessions ALTER COLUMN "isResumed" SET DEFAULT false;

-- 4. Verificar la estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
ORDER BY ordinal_position; 