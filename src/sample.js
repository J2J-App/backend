import sql from "./db/db.js";

async function getDTUData() {
  const result = await sql`SELECT * FROM dtu_2024`;
  console.log(result);
}

getDTUData();
