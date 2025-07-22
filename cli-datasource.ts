import "dotenv/config";
import { DataSource } from "typeorm";
import { getSupabaseDatabaseConfig } from "./src/app/config/database/supabase-config";

export default new DataSource(getSupabaseDatabaseConfig()); 