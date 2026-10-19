import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { EventItem } from '../services/eventService';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  event: EventItem | null;
  isDeleting?: boolean;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, event, isDeleting = false }: ConfirmDeleteModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4 border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            ยืนยันการลบกิจกรรม?
          </h3>
          
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            คุณกำลังจะลบกิจกรรม <strong className="text-slate-800 font-semibold">"{event.title}"</strong> (รหัส #{event.id}) ข้อมูลที่ลบแล้วจะไม่สามารถกู้คืนได้
          </p>

          <div className="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 border border-slate-100 space-y-1">
            <div><span className="text-slate-400">ผู้จัด:</span> {event.organizer}</div>
            <div><span className="text-slate-400">หมวดหมู่:</span> {event.category}</div>
            <div><span className="text-slate-400">วันที่:</span> {event.eventDate}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => onConfirm(event.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'กำลังลบข้อมูล...' : 'ยืนยันการลบ'}
          </button>
        </div>
      </div>
    </div>
  );
}
