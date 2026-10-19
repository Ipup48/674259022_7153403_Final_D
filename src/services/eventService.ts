import axios from 'axios';

export interface EventItem {
  id: number;
  title: string;
  organizer: string;
  category: 'อบรม' | 'สัมมนา' | 'จิตอาสา' | string;
  eventDate: string;
  description: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFormData {
  title: string;
  organizer: string;
  category: string;
  eventDate: string;
  description: string;
  status: boolean;
}

const apiClient = axios.create({
  baseURL: '/api/events',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

const handleApiError = (error: any) => {
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
  async getAllEvents(params: { title?: string; category?: string; status?: string | boolean } = {}) {
    try {
      const cleanParams: Record<string, any> = {};
      if (params.title && params.title.trim() !== '') {
        cleanParams.title = params.title.trim();
      }
      if (params.category && params.category !== 'ทั้งหมด' && params.category.trim() !== '') {
        cleanParams.category = params.category.trim();
      }
      if (params.status !== undefined && params.status !== '') {
        cleanParams.status = params.status;
      }

      const response = await apiClient.get<{ success: boolean; count: number; data: EventItem[] }>('', {
        params: cleanParams
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async getEventById(id: number | string) {
    try {
      const response = await apiClient.get<{ success: boolean; data: EventItem }>(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async createEvent(eventData: EventFormData) {
    try {
      const payload = {
        title: eventData.title.trim(),
        organizer: eventData.organizer.trim(),
        category: eventData.category.trim(),
        eventDate: eventData.eventDate,
        description: eventData.description.trim(),
        status: Boolean(eventData.status)
      };
      const response = await apiClient.post<{ success: boolean; message: string; data: EventItem }>('', payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateEvent(id: number | string, eventData: EventFormData) {
    try {
      const payload = {
        title: eventData.title.trim(),
        organizer: eventData.organizer.trim(),
        category: eventData.category.trim(),
        eventDate: eventData.eventDate,
        description: eventData.description.trim(),
        status: Boolean(eventData.status)
      };
      const response = await apiClient.put<{ success: boolean; message: string; data: EventItem }>(`/${id}`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteEvent(id: number | string) {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string; data: { id: number } }>(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

export default eventService;
