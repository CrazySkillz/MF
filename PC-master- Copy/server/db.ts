import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let db: any = null;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Using in-memory storage.");
} else {
  try {
    console.log("Initializing database connection...");
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("Database connection initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database connection:", error);
    console.warn("Falling back to in-memory storage.");
  }
}

export { pool, db };
