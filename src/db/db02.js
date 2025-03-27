import { neon } from "@neondatabase/serverless";
import "dotenv/config"; 

const sql = neon(process.env.DATABASE_URL_02);

export default sql;
