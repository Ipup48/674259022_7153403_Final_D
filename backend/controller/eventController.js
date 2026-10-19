const { Op } = require('sequelize');
const Event = require('../model/eventModel');

const ALLOWED_CATEGORIES = ['อบรม', 'สัมมนา', 'จิตอาสา'];

// Helper to validate positive integer ID
const isValidPositiveInteger = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

// 1. GET /api/events - Read all events with search & category filter
const getAllEvents = async (req, res) => {
  try {
    const { title, category, status } = req.query;
    const where = {};

    // Search by title (partial matching)
    if (title && typeof title === 'string' && title.trim() !== '') {
      where.title = {
        [Op.like]: `%${title.trim()}%`
      };
    }

    // Filter by category
    if (category && typeof category === 'string' && category.trim() !== '') {
      where.category = category.trim();
    }

    // Filter by status if provided (true/false)
    if (status !== undefined && status !== '') {
      where.status = status === 'true' || status === true;
    }

    const events = await Event.findAll({
      where,
      order: [['eventDate', 'ASC'], ['id', 'ASC']]
    });

    // If empty or populated, respond 200 with array
    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในระบบขณะดึงรายการกิจกรรม',
      error: error.message
    });
  }
};

// 2. GET /api/events/:id - Read single event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidPositiveInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสกิจกรรม (ID) ต้องเป็นจำนวนเต็มบวกเท่านั้น'
      });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบข้อมูลกิจกรรมที่มีรหัส ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error in getEventById:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในระบบขณะดึงรายละเอียดกิจกรรม',
      error: error.message
    });
  }
};

// 3. POST /api/events - Create new event
const createEvent = async (req, res) => {
  try {
    const { title, organizer, category, eventDate, description, status } = req.body;

    // Validation: Check for required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุชื่อกิจกรรม (ห้ามเป็นค่าว่างหรือมีเฉพาะช่องว่าง)'
      });
    }

    if (title.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อกิจกรรมต้องไม่เกิน 150 ตัวอักษร'
      });
    }

    if (!organizer || typeof organizer !== 'string' || organizer.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุชื่อผู้จัดกิจกรรม (ห้ามเป็นค่าว่างหรือมีเฉพาะช่องว่าง)'
      });
    }

    if (organizer.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อผู้จัดกิจกรรมต้องไม่เกิน 100 ตัวอักษร'
      });
    }

    if (!category || typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category.trim())) {
      return res.status(400).json({
        success: false,
        message: `หมวดหมู่กิจกรรมไม่ถูกต้อง ต้องเป็นหนึ่งใน: ${ALLOWED_CATEGORIES.join(', ')}`
      });
    }

    if (!eventDate || typeof eventDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate.trim())) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุวันที่จัดกิจกรรมในรูปแบบ YYYY-MM-DD ให้ถูกต้อง'
      });
    }

    // Check valid date
    const parsedDate = new Date(eventDate.trim());
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'วันที่จัดกิจกรรมไม่ถูกต้องตามปฏิทิน'
      });
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุรายละเอียดกิจกรรม (ห้ามเป็นค่าว่างหรือมีเฉพาะช่องว่าง)'
      });
    }

    if (description.trim().length < 1 || description.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'รายละเอียดกิจกรรมต้องมีความยาวระหว่าง 1 ถึง 2,000 ตัวอักษร'
      });
    }

    const newEvent = await Event.create({
      title: title.trim(),
      organizer: organizer.trim(),
      category: category.trim(),
      eventDate: eventDate.trim(),
      description: description.trim(),
      status: status !== undefined ? Boolean(status) : true
    });

    return res.status(201).json({
      success: true,
      message: 'สร้างกิจกรรมใหม่เรียบร้อยแล้ว',
      data: newEvent
    });
  } catch (error) {
    console.error('Error in createEvent:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในระบบขณะสร้างกิจกรรม',
      error: error.message
    });
  }
};

// 4. PUT /api/events/:id - Update existing event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidPositiveInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสกิจกรรม (ID) ต้องเป็นจำนวนเต็มบวกเท่านั้น'
      });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบข้อมูลกิจกรรมที่มีรหัส ID: ${id}`
      });
    }

    const { title, organizer, category, eventDate, description, status } = req.body;

    // Field-by-field validation if supplied
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'ชื่อกิจกรรมต้องไม่เป็นค่าว่าง'
        });
      }
      if (title.trim().length > 150) {
        return res.status(400).json({
          success: false,
          message: 'ชื่อกิจกรรมต้องไม่เกิน 150 ตัวอักษร'
        });
      }
      event.title = title.trim();
    }

    if (organizer !== undefined) {
      if (typeof organizer !== 'string' || organizer.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'ชื่อผู้จัดกิจกรรมต้องไม่เป็นค่าว่าง'
        });
      }
      if (organizer.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: 'ชื่อผู้จัดกิจกรรมต้องไม่เกิน 100 ตัวอักษร'
        });
      }
      event.organizer = organizer.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category.trim())) {
        return res.status(400).json({
          success: false,
          message: `หมวดหมู่กิจกรรมไม่ถูกต้อง ต้องเป็นหนึ่งใน: ${ALLOWED_CATEGORIES.join(', ')}`
        });
      }
      event.category = category.trim();
    }

    if (eventDate !== undefined) {
      if (typeof eventDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate.trim())) {
        return res.status(400).json({
          success: false,
          message: 'วันที่จัดกิจกรรมต้องอยู่ในรูปแบบ YYYY-MM-DD'
        });
      }
      const parsedDate = new Date(eventDate.trim());
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'วันที่จัดกิจกรรมไม่ถูกต้องตามปฏิทิน'
        });
      }
      event.eventDate = eventDate.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'รายละเอียดกิจกรรมต้องไม่เป็นค่าว่าง'
        });
      }
      if (description.trim().length < 1 || description.trim().length > 2000) {
        return res.status(400).json({
          success: false,
          message: 'รายละเอียดกิจกรรมต้องมีความยาวระหว่าง 1 ถึง 2,000 ตัวอักษร'
        });
      }
      event.description = description.trim();
    }

    if (status !== undefined) {
      event.status = Boolean(status);
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: 'แก้ไขข้อมูลกิจกรรมเรียบร้อยแล้ว',
      data: event
    });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในระบบขณะแก้ไขกิจกรรม',
      error: error.message
    });
  }
};

// 5. DELETE /api/events/:id - Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidPositiveInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสกิจกรรม (ID) ต้องเป็นจำนวนเต็มบวกเท่านั้น'
      });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบข้อมูลกิจกรรมที่มีรหัส ID: ${id}`
      });
    }

    const deletedTitle = event.title;
    await event.destroy();

    return res.status(200).json({
      success: true,
      message: `ลบกิจกรรม "${deletedTitle}" (ID: ${id}) เรียบร้อยแล้ว`,
      data: { id: Number(id) }
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในระบบขณะลบกิจกรรม',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
