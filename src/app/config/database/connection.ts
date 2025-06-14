import { DataSource } from "typeorm";
import { database } from "../../../app/config";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "studify_db",
  synchronize: true,
  logging: true,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
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
