import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: { rejectUnauthorized: true }
  });

  try {
    if (req.method === "PUT") {
      const { name, year, level, address, contact } = req.body;

      const [result] = await db.execute(
        "UPDATE students SET name=?, year=?, level=?, address=?, contact=? WHERE id=?",
        [name, year, level, address, contact, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      return res.json({ success: true });
    }

    if (req.method === "DELETE") {
      const [result] = await db.execute(
        "DELETE FROM students WHERE id=?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      return res.json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    await db.end();
  }
}
