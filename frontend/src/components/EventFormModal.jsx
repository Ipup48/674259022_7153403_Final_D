import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CalendarPlus, Pencil } from 'lucide-react';

const CATEGORIES = ['อบรม', 'สัมมนา', 'จิตอาสา'];

const inputBase =
  'w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-800 placeholder:text-slate-400';
const inputOk = 'border-slate-200 focus:border-brand-500';
const inputErr = 'border-rose-400 focus:border-rose-500';

const Label = ({ children }) => (
  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
    {children} <span className="text-rose-500">*</span>
  </label>
);

const FieldError = ({ message }) =>
  message ? (
    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1.5">
      <AlertCircle className="w-3 h-3" /> {message}
    </p>
  ) : null;

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
    <div className="anim-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm">
      <div className="anim-panel bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 bg-brand-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sun text-brand-950 flex items-center justify-center shrink-0">
              {isEditMode ? <Pencil className="w-5 h-5" /> : <CalendarPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">
                {isEditMode ? `แก้ไขกิจกรรม #${event.id}` : 'เพิ่มกิจกรรมใหม่'}
              </h3>
              <p className="text-xs text-brand-200 mt-0.5">
                {isEditMode ? 'ปรับปรุงข้อมูลกิจกรรมในระบบ' : 'กรอกข้อมูลรายละเอียดของกิจกรรมให้ครบถ้วน'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <Label>ชื่อกิจกรรม</Label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              placeholder="เช่น อบรมเชิงปฏิบัติการพัฒนาเว็บแอปพลิเคชัน"
              maxLength={150}
              className={`${inputBase} ${errors.title ? inputErr : inputOk}`}
            />
            <div className="flex justify-between items-start">
              {errors.title ? <FieldError message={errors.title} /> : <span />}
              <span className="text-[11px] text-slate-400 tabular-nums mt-1.5">
                {formData.title.length}/150
              </span>
            </div>
          </div>

          {/* Organizer */}
          <div>
            <Label>ผู้จัดกิจกรรม</Label>
            <input
              type="text"
              value={formData.organizer}
              onChange={(e) => {
                setFormData({ ...formData, organizer: e.target.value });
                if (errors.organizer) setErrors({ ...errors, organizer: null });
              }}
              placeholder="เช่น สาขาวิชาวิทยาการคอมพิวเตอร์ หรือ ชมรมจิตอาสา"
              maxLength={100}
              className={`${inputBase} ${errors.organizer ? inputErr : inputOk}`}
            />
            <FieldError message={errors.organizer} />
          </div>

          {/* 2-column: Category & Event Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>หมวดหมู่</Label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) setErrors({ ...errors, category: null });
                }}
                className={`${inputBase} ${errors.category ? inputErr : inputOk} cursor-pointer`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <FieldError message={errors.category} />
            </div>

            <div>
              <Label>วันที่จัดกิจกรรม</Label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => {
                  setFormData({ ...formData, eventDate: e.target.value });
                  if (errors.eventDate) setErrors({ ...errors, eventDate: null });
                }}
                className={`${inputBase} ${errors.eventDate ? inputErr : inputOk}`}
              />
              <FieldError message={errors.eventDate} />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>รายละเอียดกิจกรรม</Label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              placeholder="ระบุรายละเอียด วัตถุประสงค์ กำหนดการ หรือสถานที่จัดกิจกรรม (1-2,000 ตัวอักษร)"
              maxLength={2000}
              className={`${inputBase} resize-y ${errors.description ? inputErr : inputOk}`}
            />
            <div className="flex justify-between items-start">
              {errors.description ? <FieldError message={errors.description} /> : <span />}
              <span className="text-[11px] text-slate-400 tabular-nums mt-1.5">
                {formData.description.length}/2000
              </span>
            </div>
          </div>

          {/* Status switch */}
          <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer select-none">
            <div>
              <span className="text-sm font-semibold text-slate-800">เผยแพร่กิจกรรมทันที (Published)</span>
              <p className="text-xs text-slate-500 mt-0.5">หากไม่เลือก สถานะกิจกรรมจะถูกบันทึกเป็น "ฉบับร่าง (Draft)"</p>
            </div>
            <span className="relative shrink-0">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="peer sr-only"
              />
              <span className="block w-11 h-6 rounded-full bg-slate-300 peer-checked:bg-brand-600 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2" />
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-xl transition-colors shadow-lg shadow-brand-700/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'กำลังบันทึก...' : isEditMode ? 'บันทึกการแก้ไข' : 'สร้างกิจกรรม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
