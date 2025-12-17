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
  if (req.method === "POST") {
    const { username, password } = req.body;
    try {
      const db = await connectDB();
      const [results] = await db.execute(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password]
      );
      await db.end();
      if (results.length > 0) {
        res.status(200).json({ success: true, message: "Login successful" });
      } else {
        res.status(200).json({ success: false, message: "Invalid credentials" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
