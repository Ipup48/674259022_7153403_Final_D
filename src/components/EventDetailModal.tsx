import React from 'react';
import { X, Calendar, User, Tag, Clock, FileText, Edit3 } from 'lucide-react';
import { EventItem } from '../services/eventService';

const formatThaiDateTime = (isoString?: string) => {
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

const formatThaiDate = (dateString: string) => {
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

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onEdit?: (event: EventItem) => void;
}

export default function EventDetailModal({ isOpen, onClose, event, onEdit }: EventDetailModalProps) {
  if (!isOpen || !event) return null;

  const isPublished = Boolean(event.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 tabular-nums">
              #{event.id}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {isPublished ? 'เผยแพร่แล้ว (Published)' : 'ฉบับร่าง (Draft)'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {event.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> หมวดหมู่
              </span>
              <p className="font-semibold text-slate-800 text-sm">
                {event.category}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> วันที่จัด
              </span>
              <p className="font-semibold text-slate-800 text-sm tabular-nums">
                {formatThaiDate(event.eventDate)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> ผู้จัดกิจกรรม
              </span>
              <p className="font-semibold text-slate-800 text-sm">
                {event.organizer}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" /> รายละเอียดกิจกรรม
            </h4>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-400">
            {event.createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> สร้างเมื่อ: {formatThaiDateTime(event.createdAt)}
              </span>
            )}
            {event.updatedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> แก้ไขล่าสุด: {formatThaiDateTime(event.updatedAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(event);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            แก้ไขกิจกรรมนี้
          </button>
        </div>
      </div>
    </div>
  );
}
