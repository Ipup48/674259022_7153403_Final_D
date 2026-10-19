import React from 'react';
import { Eye, Edit3, Trash2, AlertCircle } from 'lucide-react';

const MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const splitDate = (dateString) => {
  if (!dateString) return null;
  try {
    const [year, month, day] = dateString.split('-');
    const mIdx = parseInt(month, 10) - 1;
    return {
      day: parseInt(day, 10),
      month: MONTHS_SHORT[mIdx] || month,
      year
    };
  } catch (e) {
    return null;
  }
};

const CATEGORY_STYLE = {
  อบรม: { dot: 'bg-blue-500', pill: 'bg-blue-50 text-blue-700 border-blue-100', tile: 'bg-blue-50 text-blue-700' },
  สัมมนา: { dot: 'bg-violet-500', pill: 'bg-violet-50 text-violet-700 border-violet-100', tile: 'bg-violet-50 text-violet-700' },
  จิตอาสา: { dot: 'bg-orange-500', pill: 'bg-orange-50 text-orange-700 border-orange-100', tile: 'bg-orange-50 text-orange-700' }
};
const FALLBACK_STYLE = { dot: 'bg-slate-400', pill: 'bg-slate-50 text-slate-700 border-slate-200', tile: 'bg-slate-100 text-slate-700' };

export default function EventTable({ events, onView, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm" aria-busy="true">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2.5 text-sm text-slate-500 font-medium">
          <span className="inline-block animate-spin w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full" />
          กำลังโหลดข้อมูลกิจกรรม...
        </div>
        <div className="divide-y divide-slate-100">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-14 rounded-xl bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
              </div>
              <div className="hidden md:block h-6 w-20 rounded-full bg-slate-100" />
              <div className="hidden md:block h-6 w-16 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm p-14 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">ไม่พบข้อมูลกิจกรรม</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          ไม่พบรายการกิจกรรมตามเงื่อนไขการค้นหา หรือยังไม่มีกิจกรรมในระบบ
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
              <th className="py-3.5 pl-5 pr-3 w-24">วันที่จัด</th>
              <th className="py-3.5 px-3 min-w-[280px]">กิจกรรม</th>
              <th className="py-3.5 px-3 min-w-[160px]">ผู้จัดกิจกรรม</th>
              <th className="py-3.5 px-3 min-w-[120px]">หมวดหมู่</th>
              <th className="py-3.5 px-3 min-w-[110px] text-center">สถานะ</th>
              <th className="py-3.5 pl-3 pr-5 w-32 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {events.map((event) => {
              const isPublished = Boolean(event.status);
              const cat = CATEGORY_STYLE[event.category] || FALLBACK_STYLE;
              const d = splitDate(event.eventDate);
              return (
                <tr key={event.id} className="group hover:bg-brand-50/40 transition-colors">
                  {/* Date tile */}
                  <td className="py-3.5 pl-5 pr-3 align-middle">
                    {d ? (
                      <div className={`w-14 rounded-xl py-1.5 text-center leading-tight ${cat.tile}`}>
                        <div className="text-xl font-bold tabular-nums">{d.day}</div>
                        <div className="text-[11px] font-medium">{d.month}</div>
                        <div className="text-[10px] opacity-70 tabular-nums">{d.year}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Title & snippet */}
                  <td className="py-3.5 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">#{event.id}</span>
                    </div>
                    <div
                      className="font-semibold text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors cursor-pointer"
                      onClick={() => onView(event)}
                    >
                      {event.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                      {event.description}
                    </div>
                  </td>

                  {/* Organizer */}
                  <td className="py-3.5 px-3 text-sm text-slate-600 align-middle">
                    <span className="line-clamp-1">{event.organizer}</span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${cat.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                      {event.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap align-middle">
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        เผยแพร่
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-full border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        ฉบับร่าง
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap align-middle">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => onView(event)}
                        title="ดูรายละเอียด"
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        title="แก้ไขกิจกรรม"
                        className="p-2 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(event)}
                        title="ลบกิจกรรม"
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
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
      <div className="py-3 px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>
          แสดงผล <strong className="tabular-nums font-semibold text-slate-700">{events.length}</strong> รายการ
        </span>
        <span className="text-slate-400">ชุดโจทย์ที่ 4: กิจกรรม (events)</span>
      </div>
    </div>
  );
}
