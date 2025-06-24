"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../../app/config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isProd = process.env.NODE_ENV === "production";
const entitiesPath = isProd ? "dist/models/**/*.js" : "src/models/**/*.ts";
const migrationsPath = isProd ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts";
const subscribersPath = isProd ? "dist/subscribers/**/*.js" : "src/subscribers/**/*.ts";
console.log("[DEBUG] Entities path:", entitiesPath);
console.log("[DEBUG] Migrations path:", migrationsPath);
console.log("[DEBUG] Subscribers path:", subscribersPath);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    subscribers: [subscribersPath],
    ssl: isProd ? { rejectUnauthorized: false } : false
});
const connectDB = async () => {
    try {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout al conectar a la base de datos")), 10000));
        await Promise.race([exports.AppDataSource.initialize(), timeout]);
        (0, config_1.database)("PostgreSQL Connected");
    }
    catch (error) {
        console.error("Error connecting to PostgreSQL:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
