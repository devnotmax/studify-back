"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../../app/config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
exports.AppDataSource = new typeorm_1.DataSource({
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
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        (0, config_1.database)("PostgreSQL Connected");
    }
    catch (error) {
        (0, config_1.database)("Error connecting to PostgreSQL:", error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
