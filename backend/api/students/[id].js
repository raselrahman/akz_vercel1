import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const {
    query: { id }
  } = req;

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true }
  });

  try {
    if (req.method === "PUT") {
      const { name, year, level, address, contact } = req.body;
      await db.execute(
        "UPDATE students SET name=?, year=?, level=?, address=?, contact=? WHERE id=?",
        [name, year, level, address, contact, id]
      );
      res.json({ success: true });
    } else if (req.method === "DELETE") {
      await db.execute("DELETE FROM students WHERE id=?", [id]);
      res.json({ success: true });
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
