import { config as dotenv } from "dotenv";
import { Pool } from "pg";

dotenv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
