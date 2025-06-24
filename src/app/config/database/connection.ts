import { DataSource } from "typeorm";
import { database } from "../../../app/config";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    database("PostgreSQL Connected");
  } catch (error) {
    database("Error connecting to PostgreSQL:", error);
    process.exit(1);
  }
};
