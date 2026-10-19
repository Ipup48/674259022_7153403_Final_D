import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, event, isDeleting = false }) {
  if (!isOpen || !event) return null;

  return (
    <div className="anim-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm">
      <div className="anim-panel bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Body */}
        <div className="p-7 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-5 ring-8 ring-rose-50/60">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">ยืนยันการลบกิจกรรม?</h3>

          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            คุณกำลังจะลบกิจกรรม{' '}
            <strong className="text-slate-800 font-semibold">"{event.title}"</strong> (รหัส #{event.id}) ข้อมูลที่ลบแล้วจะไม่สามารถกู้คืนได้
          </p>

          <dl className="p-4 bg-slate-50 rounded-2xl text-left text-sm space-y-2 border border-slate-100">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">ผู้จัด</dt>
              <dd className="text-slate-700 font-medium text-right">{event.organizer}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">หมวดหมู่</dt>
              <dd className="text-slate-700 font-medium text-right">{event.category}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">วันที่</dt>
              <dd className="text-slate-700 font-medium text-right tabular-nums">{event.eventDate}</dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => onConfirm(event.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'กำลังลบข้อมูล...' : 'ยืนยันการลบ'}
          </button>
        </div>
      </div>
    </div>
  );
}
