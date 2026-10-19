import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = ['อบรม', 'สัมมนา', 'จิตอาสา'];

export default function EventFormModal({ isOpen, onClose, onSave, event = null, isSubmitting = false }) {
  const isEditMode = Boolean(event && event.id);

  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    category: 'อบรม',
    eventDate: '',
    description: '',
    status: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        organizer: event.organizer || '',
        category: event.category || 'อบรม',
        eventDate: event.eventDate || '',
        description: event.description || '',
        status: event.status !== undefined ? Boolean(event.status) : true
      });
    } else {
      // Default initial state for new event
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        organizer: '',
        category: 'อบรม',
        eventDate: today,
        description: '',
        status: true
      });
    }
    setErrors({});
  }, [event, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'กรุณากรอกชื่อกิจกรรม (ห้ามเป็นค่าว่างหรือมีเฉพาะช่องว่าง)';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'ชื่อกิจกรรมต้องไม่เกิน 150 ตัวอักษร';
    }

    if (!formData.organizer || formData.organizer.trim() === '') {
      newErrors.organizer = 'กรุณากรอกชื่อผู้จัดกิจกรรม (ห้ามเป็นค่าว่าง)';
    } else if (formData.organizer.trim().length > 100) {
      newErrors.organizer = 'ชื่อผู้จัดกิจกรรมต้องไม่เกิน 100 ตัวอักษร';
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่ที่ถูกต้อง';
    }

    if (!formData.eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(formData.eventDate)) {
      newErrors.eventDate = 'กรุณาระบุวันที่จัดกิจกรรมให้ถูกต้อง (YYYY-MM-DD)';
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'กรุณากรอกรายละเอียดกิจกรรม (ห้ามเป็นค่าว่าง)';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'รายละเอียดกิจกรรมต้องไม่เกิน 2,000 ตัวอักษร';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditMode ? `แก้ไขกิจกรรม #${event.id}` : 'เพิ่มกิจกรรมใหม่'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditMode ? 'ปรับปรุงข้อมูลกิจกรรมในระบบ' : 'กรอกข้อมูลรายละเอียดของกิจกรรมให้ครบถ้วน'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              ชื่อกิจกรรม <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              placeholder="เช่น อบรมเชิงปฏิบัติการพัฒนาเว็บแอปพลิเคชัน"
              maxLength={150}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.title ? (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              ) : <span />}
              <span className="text-[11px] text-slate-400 tabular-nums">
                {formData.title.length}/150
              </span>
            </div>
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              ผู้จัดกิจกรรม <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.organizer}
              onChange={(e) => {
                setFormData({ ...formData, organizer: e.target.value });
                if (errors.organizer) setErrors({ ...errors, organizer: null });
              }}
              placeholder="เช่น สาขาวิชาวิทยาการคอมพิวเตอร์ หรือ ชมรมจิตอาสา"
              maxLength={100}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.organizer ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
            />
            {errors.organizer && (
              <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.organizer}
              </p>
            )}
          </div>

          {/* 2-column: Category & Event Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                หมวดหมู่ <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) setErrors({ ...errors, category: null });
                }}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                วันที่จัดกิจกรรม <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => {
                  setFormData({ ...formData, eventDate: e.target.value });
                  if (errors.eventDate) setErrors({ ...errors, eventDate: null });
                }}
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.eventDate ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {errors.eventDate && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.eventDate}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              รายละเอียดกิจกรรม <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              placeholder="ระบุรายละเอียด วัตถุประสงค์ กำหนดการ หรือสถานที่จัดกิจกรรม (1-2,000 ตัวอักษร)"
              maxLength={2000}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.description ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              ) : <span />}
              <span className="text-[11px] text-slate-400 tabular-nums">
                {formData.description.length}/2000
              </span>
            </div>
          </div>

          {/* Status Checkbox / Switch */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-800">เผยแพร่กิจกรรมทันที (Published)</span>
                <p className="text-xs text-slate-500">หากไม่เลือก สถานะกิจกรรมจะถูกบันทึกเป็น "ฉบับร่าง (Draft)"</p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSubmitting ? 'กำลังบันทึก...' : isEditMode ? 'บันทึกการแก้ไข' : 'สร้างกิจกรรม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
