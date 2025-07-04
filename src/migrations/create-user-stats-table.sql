-- Crear tabla user_stats completa
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_sessions INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0,
    average_session_duration INTEGER DEFAULT 0,
    longest_session INTEGER DEFAULT 0,
    longest_session_date TIMESTAMP DEFAULT NOW(),
    total_focus_time INTEGER DEFAULT 0,
    total_break_time INTEGER DEFAULT 0,
    total_long_break_time INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_activity ON user_stats(last_activity_date);

-- Agregar comentarios a la tabla
COMMENT ON TABLE user_stats IS 'Estadísticas de usuarios para tracking de sesiones y rachas';
COMMENT ON COLUMN user_stats.current_streak IS 'Racha actual de días consecutivos';
COMMENT ON COLUMN user_stats.longest_streak IS 'Racha más larga de días consecutivos';
COMMENT ON COLUMN user_stats.last_activity_date IS 'Última fecha de actividad del usuario'; 