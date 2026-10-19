const { Sequelize } = require("sequelize");

// ดึงค่า Connection String (ลำดับความสำคัญ: DATABASE_URL > POSTGRES_URL)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let sequelize;

if (connectionString) {
  // เชื่อมต่อ Neon PostgreSQL
  sequelize = new Sequelize(connectionString, {
    dialect: "postgres",
    dialectModule: require("pg"), // บังคับใช้ pg module สำหรับ PostgreSQL
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // ป้องกันปัญหา SSL Certificate verification บน Cloud (Render/Vercel)
      },
    },
    logging: false, // ปิด log SQL queries ใน production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // fallback สำหรับรัน Local (SQLite)
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    logging: false,
  });
}

module.exports = sequelize;
