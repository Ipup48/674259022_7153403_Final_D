import axios from 'axios';

// Get API URL from Vite environment or default to relative /api/events or localhost
const BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/api/events` : 'http://localhost:5000/api/events');

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Helper to extract clean error message
const handleApiError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  } else if (error.response && error.response.data && error.response.data.error) {
    throw new Error(error.response.data.error);
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
  }
};

export const eventService = {
  // 1. อ่านรายการกิจกรรมทั้งหมด รองรับการค้นหา (title) และกรองหมวดหมู่ (category)
  async getAllEvents(params = {}) {
    try {
      const cleanParams = {};
      if (params.title && params.title.trim() !== '') {
        cleanParams.title = params.title.trim();
      }
      if (params.category && params.category !== 'ทั้งหมด' && params.category.trim() !== '') {
        cleanParams.category = params.category.trim();
      }
      if (params.status !== undefined && params.status !== '') {
        cleanParams.status = params.status;
      }

      const response = await apiClient.get('', { params: cleanParams });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // 2. ดึงรายละเอียดกิจกรรม 1 รายการ ตาม ID
  async getEventById(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // 3. เพิ่มกิจกรรมใหม่
  async createEvent(eventData) {
    try {
      const payload = {
        title: eventData.title?.trim(),
        organizer: eventData.organizer?.trim(),
        category: eventData.category?.trim(),
        eventDate: eventData.eventDate,
        description: eventData.description?.trim(),
        status: Boolean(eventData.status)
      };
      const response = await apiClient.post('', payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // 4. แก้ไขข้อมูลกิจกรรม
  async updateEvent(id, eventData) {
    try {
      const payload = {
        title: eventData.title?.trim(),
        organizer: eventData.organizer?.trim(),
        category: eventData.category?.trim(),
        eventDate: eventData.eventDate,
        description: eventData.description?.trim(),
        status: Boolean(eventData.status)
      };
      const response = await apiClient.put(`/${id}`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // 5. ลบข้อมูลกิจกรรม
  async deleteEvent(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

export default eventService;
