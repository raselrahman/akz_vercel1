// api/login.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      ssl: {
        rejectUnauthorized: false   // ✅ REQUIRED for Vercel + TiDB
      }
    });

    const [rows] = await db.execute(
      "SELECT id, username FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    await db.end();

    if (rows.length > 0) {
      return res.json({ success: true, user: rows[0] });
    }

    return res.json({ success: false, message: "Invalid credentials" });

  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
