import React from 'react';
import { Eye, Edit3, Trash2, Calendar, User, Tag, AlertCircle } from 'lucide-react';

const formatThaiDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const mIdx = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)} ${monthsThai[mIdx] || month} ${year}`;
  } catch (e) {
    return dateString;
  }
};

export default function EventTable({ events, onView, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-8 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full mb-3" />
        <p className="text-sm text-slate-500 font-medium">กำลังโหลดข้อมูลกิจกรรม...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">ไม่พบข้อมูลกิจกรรม</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          ไม่พบรายการกิจกรรมตามเงื่อนไขการค้นหา หรือยังไม่มีกิจกรรมในระบบ
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16 text-center tabular-nums">รหัส</th>
              <th className="py-3.5 px-4 min-w-[240px]">ชื่อกิจกรรม</th>
              <th className="py-3.5 px-4 min-w-[160px]">ผู้จัดกิจกรรม</th>
              <th className="py-3.5 px-4 min-w-[110px]">หมวดหมู่</th>
              <th className="py-3.5 px-4 min-w-[130px] tabular-nums">วันที่จัดกิจกรรม</th>
              <th className="py-3.5 px-4 min-w-[110px] text-center">สถานะ</th>
              <th className="py-3.5 px-4 w-32 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {events.map((event) => {
              const isPublished = Boolean(event.status);
              return (
                <tr
                  key={event.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* ID */}
                  <td className="py-3 px-4 text-center text-xs font-mono tabular-nums text-slate-500">
                    #{event.id}
                  </td>

                  {/* Title & snippet */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 line-clamp-1 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onView(event)}>
                      {event.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                      {event.description}
                    </div>
                  </td>

                  {/* Organizer */}
                  <td className="py-3 px-4 text-xs text-slate-600">
                    <span className="line-clamp-1">{event.organizer}</span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-xs font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.category === 'อบรม'
                            ? 'bg-blue-600'
                            : event.category === 'สัมมนา'
                            ? 'bg-indigo-600'
                            : 'bg-emerald-600'
                        }`}
                      />
                      {event.category}
                    </span>
                  </td>

                  {/* Event Date */}
                  <td className="py-3 px-4 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                    {formatThaiDate(event.eventDate)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                        เผยแพร่
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                        ฉบับร่าง
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 justify-end">
                      {/* View button */}
                      <button
                        type="button"
                        onClick={() => onView(event)}
                        title="ดูรายละเอียด"
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        title="แก้ไขกิจกรรม"
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => onDelete(event)}
                        title="ลบกิจกรรม"
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count */}
      <div className="py-2.5 px-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>
          แสดงผล <strong className="tabular-nums font-semibold text-slate-700">{events.length}</strong> รายการ
        </span>
        <span className="text-slate-400">ชุดโจทย์ที่ 4: กิจกรรม (events)</span>
      </div>
    </div>
  );
}
