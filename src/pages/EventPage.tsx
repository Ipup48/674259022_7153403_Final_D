import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Layers,
  HeartHandshake,
  GraduationCap,
  Users
} from 'lucide-react';
import eventService, { EventItem, EventFormData } from '../services/eventService';
import EventTable from '../components/EventTable';
import EventFormModal from '../components/EventFormModal';
import EventDetailModal from '../components/EventDetailModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function EventPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [searchTitle, setSearchTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: { title?: string; category?: string; status?: string } = {};
      if (searchTitle.trim()) params.title = searchTitle.trim();
      if (selectedCategory && selectedCategory !== 'ทั้งหมด') params.category = selectedCategory;
      if (selectedStatus !== '') params.status = selectedStatus;

      const res = await eventService.getAllEvents(params);
      if (res && res.data) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'ไม่สามารถโหลดข้อมูลกิจกรรมได้ กรุณาตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsLoading(false);
    }
  }, [searchTitle, selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (event: EventItem) => {
    setDeletingEvent(event);
    setIsDeleteOpen(true);
  };

  const handleSaveEvent = async (formData: EventFormData) => {
    try {
      setIsSubmitting(true);
      if (editingEvent && editingEvent.id) {
        await eventService.updateEvent(editingEvent.id, formData);
        showToast(`แก้ไขกิจกรรม "${formData.title}" เรียบร้อยแล้ว`);
      } else {
        await eventService.createEvent(formData);
        showToast(`เพิ่มกิจกรรมใหม่ "${formData.title}" สำเร็จแล้ว`);
      }
      setIsFormOpen(false);
      setEditingEvent(null);
      await fetchEvents();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      await eventService.deleteEvent(id);
      showToast('ลบกิจกรรมเรียบร้อยแล้ว');
      setIsDeleteOpen(false);
      setDeletingEvent(null);
      await fetchEvents();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาดในการลบ: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCount = events.length;
  const trainingCount = events.filter((e) => e.category === 'อบรม').length;
  const seminarCount = events.filter((e) => e.category === 'สัมมนา').length;
  const volunteerCount = events.filter((e) => e.category === 'จิตอาสา').length;
  const publishedCount = events.filter((e) => Boolean(e.status)).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Sarabun',sans-serif]">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-lg text-sm">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              E
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                ระบบจัดการกิจกรรม (Event Management)
              </h1>
              <p className="text-xs text-slate-500">
                ชุดโจทย์ที่ 4 หมวดหมู่ D (อบรม, สัมมนา, จิตอาสา) · นายวุฒิชัย จันทร์มีชัย
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchEvents}
              title="รีเฟรชข้อมูล"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มกิจกรรมใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold">ข้อผิดพลาดในการโหลดข้อมูล:</strong>
              <p className="mt-0.5 text-rose-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchEvents}
              className="text-xs font-semibold px-2.5 py-1 bg-white border border-rose-300 rounded hover:bg-rose-100 text-rose-700"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">กิจกรรมทั้งหมด</span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              เผยแพร่แล้ว <span className="tabular-nums font-medium text-emerald-600">{publishedCount}</span> รายการ
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">หมวดอบรม</span>
              <GraduationCap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600 tabular-nums">
              {trainingCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              การพัฒนาทักษะเชิงปฏิบัติการ
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">หมวดสัมมนา</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-indigo-600 tabular-nums">
              {seminarCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              เวทีวิชาการและแนวคิดอนาคต
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">หมวดจิตอาสา</span>
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">
              {volunteerCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              กิจกรรมเพื่อสังคมและสิ่งแวดล้อม
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="ค้นหาชื่อกิจกรรม (Op.like)..."
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              {['ทั้งหมด', 'อบรม', 'สัมมนา', 'จิตอาสา'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
            >
              <option value="">ทุกสถานะ</option>
              <option value="true">เผยแพร่แล้ว</option>
              <option value="false">ฉบับร่าง</option>
            </select>
          </div>
        </div>

        {/* Events Table */}
        <EventTable
          events={events}
          onView={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>ผู้จัดทำ:</strong> นายวุฒิชัย จันทร์มีชัย | ชุดโจทย์ที่ 4: กิจกรรม (events / /api/events)
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>หมวดหมู่ D: อบรม, สัมมนา, จิตอาสา</span>
            <span>RESTful API CRUD</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
        isSubmitting={isSubmitting}
      />

      <EventDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={(event) => {
          setIsDetailOpen(false);
          handleOpenEdit(event);
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingEvent(null);
        }}
        onConfirm={handleConfirmDelete}
        event={deletingEvent}
        isDeleting={isDeleting}
      />
    </div>
  );
}
