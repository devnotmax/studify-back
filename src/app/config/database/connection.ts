import { DataSource } from "typeorm";
import { database } from "../../../app/config";
import dotenv from "dotenv";
import { getRenderDatabaseConfig, validateDatabaseConfig } from "./render-config";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const entitiesPath = isProd ? "dist/models/**/*.js" : "src/models/**/*.ts";
const migrationsPath = isProd ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts";
const subscribersPath = isProd ? "dist/subscribers/**/*.js" : "src/subscribers/**/*.ts";

console.log("[DEBUG] Entities path:", entitiesPath);
console.log("[DEBUG] Migrations path:", migrationsPath);
console.log("[DEBUG] Subscribers path:", subscribersPath);

// Usar la configuración específica para Render
export const AppDataSource = new DataSource(getRenderDatabaseConfig());

export const connectDB = async () => {
  try {
    console.log("[DEBUG] Iniciando conexión a la base de datos...");
    console.log("[DEBUG] NODE_ENV:", process.env.NODE_ENV);
    console.log("[DEBUG] DATABASE_URL exists:", !!process.env.DATABASE_URL);
    
    // Validar configuración antes de intentar conectar
    const validation = validateDatabaseConfig();
    if (!validation.isValid) {
      console.error("[ERROR] Configuración de base de datos inválida:");
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error("Configuración de base de datos inválida");
    }
    
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout al conectar a la base de datos")), 30000)
    );
    
    await Promise.race([AppDataSource.initialize(), timeout]);
    database("PostgreSQL Connected");
    console.log("[DEBUG] Conexión a la base de datos establecida exitosamente");
  } catch (error: any) {
    console.error("Error connecting to PostgreSQL:", error);
    console.error("[DEBUG] Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });
    
    // En producción, no salir inmediatamente, dar tiempo para reintentos
    if (!isProd) {
      process.exit(1);
    } else {
      console.log("[DEBUG] En producción, continuando sin conexión a BD...");
      throw error; // Re-lanzar el error para que el manejador principal lo capture
    }
  }
};
