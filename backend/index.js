const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const eventRouter = require("./router/eventRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins for local dev and Vercel/Render deployments
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Root endpoint - ปรับข้อความต้อนรับ Welcome to Render
app.get("/", (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Render - Event Management API</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; max-width: 500px; width: 90%; }
        h1 { color: #46e3b7; background: #111b27; padding: 12px; border-radius: 8px; margin-top: 0; font-size: 1.8rem; }
        p { margin: 8px 0; color: #555; }
        .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 16px; font-weight: bold; margin-bottom: 12px; }
        a { color: #0066cc; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Welcome to Render! 🚀</h1>
        <div class="badge">● Status: Online</div>
        <p><strong>ระบบจัดการกิจกรรม (Event Management API)</strong></p>
        <p>ผู้พัฒนา: นายวุฒิชัย จันทร์มีชัย</p>
        <p>ชุดโจทย์ที่ 4 (หมวดหมู่ D: อบรม, สัมมนา, จิตอาสา)</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
        <p>📍 เส้นทาง API: <a href="/api/events">/api/events</a></p>
      </div>
    </body>
    </html>
  `);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date() });
});

// Event Routes
app.use("/api/events", eventRouter);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `ไม่พบเส้นทาง API: ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    message: "เกิดข้อผิดพลาดร้ายแรงภายในเซิร์ฟเวอร์",
    error: err.message,
  });
});

// Start Server and Sync Database
const startServer = async () => {
  try {
    console.log("🔄 กำลังเชื่อมต่อและซิงค์ฐานข้อมูล SQLite...");
    await sequelize.authenticate();
    await sequelize.sync(); // Creates table if it does not exist
    console.log("✅ ฐานข้อมูล SQLite พร้อมใช้งานเรียบร้อยแล้ว");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 เซิร์ฟเวอร์ API ทำงานแล้วที่ http://0.0.0.0:${PORT}`);
      console.log(`📌 เส้นทางกิจกรรม: http://localhost:${PORT}/api/events`);
    });
  } catch (error) {
    console.error("❌ ไม่สามารถเริ่มต้นเซิร์ฟเวอร์ได้:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
