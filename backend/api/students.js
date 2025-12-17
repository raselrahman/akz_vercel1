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
  const db = await connectDB();
  try {
    if (req.method === "GET") {
      const [results] = await db.query("SELECT * FROM students");
      res.status(200).json(results);
    } else if (req.method === "POST") {
      const { name, year, level, address, contact } = req.body;
      const [result] = await db.execute(
        "INSERT INTO students (name, year, level, address, contact) VALUES (?, ?, ?, ?, ?)",
        [name, year, level, address, contact]
      );
      res.status(201).json({ id: result.insertId, name, year, level, address, contact });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.end();
  }
}
