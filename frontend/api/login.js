// api/login.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE, // ✅ FIXED
      port: Number(process.env.DB_PORT) || 4000,
      ssl: { rejectUnauthorized: true }, // ✅ TiDB requirement
    });

    const [rows] = await db.execute(
      "SELECT id, username FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    await db.end();

    if (rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: rows[0],
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
}
