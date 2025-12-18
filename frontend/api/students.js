import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true }
  });

  try {
    if (req.method === "GET") {
      const [rows] = await db.execute("SELECT * FROM students");
      res.json(rows);
    } else if (req.method === "POST") {
      const { name, year, level, address, contact } = req.body;
      const [result] = await db.execute(
        "INSERT INTO students (name, year, level, address, contact) VALUES (?, ?, ?, ?, ?)",
        [name, year, level, address, contact]
      );
      res.json({ id: result.insertId, name, year, level, address, contact });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    await db.end();
  }
}
