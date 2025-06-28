import { DataSourceOptions } from "typeorm";

export const getRenderDatabaseConfig = (): DataSourceOptions => {
  const isProd = process.env.NODE_ENV === "production";
  
  // Configuración base
  const baseConfig: DataSourceOptions = {
    type: "postgres",
    synchronize: false,
    logging: isProd ? false : true,
    entities: [isProd ? "dist/models/**/*.js" : "src/models/**/*.ts"],
    migrations: [isProd ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts"],
    subscribers: [isProd ? "dist/subscribers/**/*.js" : "src/subscribers/**/*.ts"],
  };

  // Si estamos en producción (Render)
  if (isProd) {
    return {
      ...baseConfig,
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
        ca: process.env.SSL_CA,
        cert: process.env.SSL_CERT,
        key: process.env.SSL_KEY,
      },
      extra: {
        ssl: {
          rejectUnauthorized: false,
          // Configuración específica para Supabase
          checkServerIdentity: () => undefined,
        },
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        max: 20, // Máximo número de conexiones
        min: 2,  // Mínimo número de conexiones
      },
    };
  }

  // Configuración para desarrollo
  return {
    ...baseConfig,
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    extra: {
      ssl: {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
      },
    },
  };
};

// Función para validar la configuración de la base de datos
export const validateDatabaseConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!process.env.DATABASE_URL) {
    errors.push("DATABASE_URL no está configurada");
  }
  
  if (process.env.NODE_ENV === "production") {
    const dbUrl = process.env.DATABASE_URL || "";
    if (!dbUrl.includes("sslmode=require") && !dbUrl.includes("ssl=true")) {
      errors.push("En producción, la DATABASE_URL debe incluir SSL (sslmode=require)");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 