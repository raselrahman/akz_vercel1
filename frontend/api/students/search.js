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
  const { query } = req.query;
  const db = await connectDB();
  try {
    const [results] = await db.execute(
      "SELECT * FROM students WHERE name LIKE ? OR id LIKE ?",
      [`%${query}%`, `%${query}%`]
    );
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.end();
  }
}
