// api/login.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Connect to MySQL using environment variables
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    });

    // Query with prepared statement
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    await db.end();

    if (rows.length > 0) {
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(200).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
