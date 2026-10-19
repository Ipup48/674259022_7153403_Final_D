const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'ชื่อกิจกรรมต้องไม่เป็นค่าว่าง' },
      len: { args: [1, 150], msg: 'ชื่อกิจกรรมต้องมีความยาวระหว่าง 1 ถึง 150 ตัวอักษร' }
    }
  },
  organizer: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'ชื่อผู้จัดกิจกรรมต้องไม่เป็นค่าว่าง' },
      len: { args: [1, 100], msg: 'ชื่อผู้จัดกิจกรรมต้องมีความยาวระหว่าง 1 ถึง 100 ตัวอักษร' }
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [['อบรม', 'สัมมนา', 'จิตอาสา']],
        msg: 'หมวดหมู่ต้องเป็น อบรม, สัมมนา หรือ จิตอาสา เท่านั้น'
      }
    }
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'วันที่จัดกิจกรรมต้องอยู่ในรูปแบบวันที่ที่ถูกต้อง (YYYY-MM-DD)' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'รายละเอียดกิจกรรมต้องไม่เป็นค่าว่าง' },
      len: { args: [1, 2000], msg: 'รายละเอียดกิจกรรมต้องมีความยาวระหว่าง 1 ถึง 2,000 ตัวอักษร' }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event;
