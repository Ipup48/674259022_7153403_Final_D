import React from 'react';
import { X, Calendar, User, Tag, Clock, FileText, Edit3 } from 'lucide-react';

const formatThaiDateTime = (isoString) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
};

const formatThaiDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    const monthsThai = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const mIdx = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)} ${monthsThai[mIdx] || month} ${year}`;
  } catch (e) {
    return dateString;
  }
};

const CATEGORY_BAR = {
  อบรม: 'bg-blue-500',
  สัมมนา: 'bg-violet-500',
  จิตอาสา: 'bg-orange-500'
};

export default function EventDetailModal({ isOpen, onClose, event, onEdit }) {
  if (!isOpen || !event) return null;

  const isPublished = Boolean(event.status);

  return (
    <div className="anim-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm">
      <div className="anim-panel bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Category colour bar */}
        <div className={`h-1.5 ${CATEGORY_BAR[event.category] || 'bg-slate-400'}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 tabular-nums">
              #{event.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {isPublished ? 'เผยแพร่แล้ว (Published)' : 'ฉบับร่าง (Draft)'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">{event.title}</h2>

          {/* Key Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> หมวดหมู่
              </span>
              <p className="font-semibold text-slate-900 text-sm">{event.category}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> วันที่จัด
              </span>
              <p className="font-semibold text-slate-900 text-sm tabular-nums">
                {formatThaiDate(event.eventDate)}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> ผู้จัดกิจกรรม
              </span>
              <p className="font-semibold text-slate-900 text-sm">{event.organizer}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-600" /> รายละเอียดกิจกรรม
            </h4>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
            {event.createdAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> สร้างเมื่อ: {formatThaiDateTime(event.createdAt)}
              </span>
            )}
            {event.updatedAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> แก้ไขล่าสุด: {formatThaiDateTime(event.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(event);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-xl transition-colors shadow-lg shadow-brand-700/20"
          >
            <Edit3 className="w-4 h-4" />
            แก้ไขกิจกรรมนี้
          </button>
        </div>
      </div>
    </div>
  );
}
