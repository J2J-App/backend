import { neon } from "@neondatabase/serverless";
import "dotenv/config"; 

const sql = neon(process.env.DATABASE_URL);

export default sql;
