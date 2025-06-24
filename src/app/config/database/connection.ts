import { DataSource } from "typeorm";
import { database } from "../../../app/config";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const entitiesPath = isProd ? "dist/models/**/*.js" : "src/models/**/*.ts";
const migrationsPath = isProd ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts";
const subscribersPath = isProd ? "dist/subscribers/**/*.js" : "src/subscribers/**/*.ts";

console.log("[DEBUG] Entities path:", entitiesPath);
console.log("[DEBUG] Migrations path:", migrationsPath);
console.log("[DEBUG] Subscribers path:", subscribersPath);

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  subscribers: [subscribersPath],
  ssl: isProd ? { rejectUnauthorized: false } : false
});

export const connectDB = async () => {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout al conectar a la base de datos")), 10000)
    );
    await Promise.race([AppDataSource.initialize(), timeout]);
    database("PostgreSQL Connected");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1);
  }
};
