import axios from "axios";

// ดึง Base URL จาก Environment Variable หรือใช้ /api/events สำหรับ Vercel/Local
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/events`
  : "/api/events";

// ดึงรายการกิจกรรมทั้งหมด (รองรับ filter: title, category, status)
const getAllEvents = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// ดึงข้อมูลกิจกรรมตาม ID
const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// สร้างกิจกรรมใหม่
const createEvent = async (eventData) => {
  const response = await axios.post(API_URL, eventData);
  return response.data;
};

// แก้ไขข้อมูลกิจกรรม
const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/${id}`, eventData);
  return response.data;
};

// ลบกิจกรรม
const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const eventService = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};

export default eventService;
