import { DataSourceOptions } from "typeorm";

export const getSupabaseDatabaseConfig = (): DataSourceOptions => {
  const isProd = process.env.NODE_ENV === "production";
  
  return {
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: isProd ? false : true,
    entities: [isProd ? "dist/models/**/*.js" : "src/models/**/*.ts"],
    migrations: [isProd ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts"],
    subscribers: [isProd ? "dist/subscribers/**/*.js" : "src/subscribers/**/*.ts"],
    ssl: {
      rejectUnauthorized: false,
    },
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
  };
}; 