import { config as dotenv } from "dotenv";
import { Pool } from "pg";

dotenv();

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

export default pool;
