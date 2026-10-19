import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Layers,
  HeartHandshake,
  GraduationCap,
  Users,
} from "lucide-react";

// ตรวจสอบ Relative Path ให้ถูกต้อง (ถอย 1 ชั้นออกจากโฟลเดอร์ pages เพื่อเข้าโฟลเดอร์ services และ components)
import eventService from "../services/eventService";
import EventTable from "../components/EventTable";
import EventFormModal from "../components/EventFormModal";
import EventDetailModal from "../components/EventDetailModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {};
      if (searchTitle.trim()) params.title = searchTitle.trim();
      if (selectedCategory && selectedCategory !== "ทั้งหมด")
        params.category = selectedCategory;
      if (selectedStatus !== "") params.status = selectedStatus;

      const res = await eventService.getAllEvents(params);
      if (res && res.data) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.message ||
          "ไม่สามารถโหลดข้อมูลกิจกรรมได้ กรุณาตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์",
      );
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

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (event) => {
    setDeletingEvent(event);
    setIsDeleteOpen(true);
  };

  const handleSaveEvent = async (formData) => {
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
    } catch (err) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      setIsDeleting(true);
      await eventService.deleteEvent(id);
      showToast("ลบกิจกรรมเรียบร้อยแล้ว");
      setIsDeleteOpen(false);
      setDeletingEvent(null);
      await fetchEvents();
    } catch (err) {
      alert(`เกิดข้อผิดพลาดในการลบ: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCount = events.length;
  const trainingCount = events.filter((e) => e.category === "อบรม").length;
  const seminarCount = events.filter((e) => e.category === "สัมมนา").length;
  const volunteerCount = events.filter((e) => e.category === "จิตอาสา").length;

  const stats = [
    {
      label: "กิจกรรมทั้งหมด",
      value: totalCount,
      icon: Layers,
      color: "from-teal-600 to-emerald-700",
    },
    {
      label: "หมวดอบรม",
      value: trainingCount,
      icon: GraduationCap,
      color: "from-indigo-600 to-blue-700",
    },
    {
      label: "หมวดสัมมนา",
      value: seminarCount,
      icon: Users,
      color: "from-purple-600 to-pink-700",
    },
    {
      label: "หมวดจิตอาสา",
      value: volunteerCount,
      icon: HeartHandshake,
      color: "from-emerald-600 to-teal-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="anim-toast fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl text-sm font-medium">
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-teal-950 flex items-center justify-center shadow-lg shadow-amber-400/20">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight block leading-none">
                  Event Management
                </span>
                <span className="text-[11px] text-teal-300 font-medium">
                  ชุดโจทย์ที่ 4: กิจกรรม (events)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchEvents}
                className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="รีเฟรชข้อมูล"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-teal-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-400/20"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มกิจกรรมใหม่</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {s.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-3 tabular-nums">
                  {s.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="ค้นหาชื่อกิจกรรม..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200/70 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl text-xs font-medium text-slate-600">
              {["ทั้งหมด", "อบรม", "สัมมนา", "จิตอาสา"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                    selectedCategory === cat
                      ? "bg-white text-teal-800 shadow-sm"
                      : "hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 text-xs font-bold bg-slate-100 border border-transparent rounded-2xl focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="">ทุกสถานะ</option>
              <option value="true">เผยแพร่แล้ว</option>
              <option value="false">ฉบับร่าง</option>
            </select>
          </div>
        </div>

        {/* Event Table / Cards */}
        <EventTable
          events={events}
          onView={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-slate-200 font-bold">ผู้จัดทำ:</strong>{" "}
            นายวุฒิชัย จันทร์มีชัย | หมวดหมู่ D (อบรม, สัมมนา, จิตอาสา)
          </div>
          <div className="text-slate-500">
            ระบบจัดการกิจกรรม Event Management System
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
