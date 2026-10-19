const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const eventRouter = require('./router/eventRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local dev and Vercel/Render deployments
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'ระบบจัดการกิจกรรม (Event Management API)',
    author: 'นายวุฒิชัย จันทร์มีชัย',
    assignment: 'ชุดโจทย์ที่ 4: กิจกรรม (events / /api/events)',
    category: 'หมวดหมู่ D: อบรม, สัมมนา, จิตอาสา',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      getAllEvents: 'GET /api/events',
      getEventById: 'GET /api/events/:id',
      createEvent: 'POST /api/events',
      updateEvent: 'PUT /api/events/:id',
      deleteEvent: 'DELETE /api/events/:id'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// Event Routes
app.use('/api/events', eventRouter);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `ไม่พบเส้นทาง API: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'เกิดข้อผิดพลาดร้ายแรงภายในเซิร์ฟเวอร์',
    error: err.message
  });
});

// Start Server and Sync Database
const startServer = async () => {
  try {
    console.log('🔄 กำลังเชื่อมต่อและซิงค์ฐานข้อมูล SQLite...');
    await sequelize.authenticate();
    await sequelize.sync(); // Creates table if it does not exist
    console.log('✅ ฐานข้อมูล SQLite พร้อมใช้งานเรียบร้อยแล้ว');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 เซิร์ฟเวอร์ API ทำงานแล้วที่ http://0.0.0.0:${PORT}`);
      console.log(`📌 เส้นทางกิจกรรม: http://localhost:${PORT}/api/events`);
    });
  } catch (error) {
    console.error('❌ ไม่สามารถเริ่มต้นเซิร์ฟเวอร์ได้:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
