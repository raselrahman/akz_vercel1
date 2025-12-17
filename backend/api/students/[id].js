import mysql from "mysql2/promise";

const connectDB = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true }
  });
};

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await connectDB();
  try {
    if (req.method === "PUT") {
      const { name, year, level, address, contact } = req.body;
      await db.execute(
        "UPDATE students SET name=?, year=?, level=?, address=?, contact=? WHERE id=?",
        [name, year, level, address, contact, id]
      );
      res.status(200).json({ success: true });
    } else if (req.method === "DELETE") {
      await db.execute("DELETE FROM students WHERE id=?", [id]);
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.end();
  }
}
