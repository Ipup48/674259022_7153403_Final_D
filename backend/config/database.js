const { Sequelize } = require("sequelize");

// ดึงค่า Connection String จาก Environment Variable (รองรับทั้ง DATABASE_URL และ POSTGRES_URL)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let sequelize;

if (connectionString) {
  // หากมี Connection String ให้เชื่อมต่อกับ Neon PostgreSQL
  sequelize = new Sequelize(connectionString, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // จำเป็นสำหรับการเชื่อมต่อกับ Neon SSL บน Render
      },
    },
    logging: false,
  });
} else {
  // หากไม่มี ให้ใช้อย่างเดิมในเครื่อง (SQLite)
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    logging: false,
  });
}

module.exports = sequelize;
