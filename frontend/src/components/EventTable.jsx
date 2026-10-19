import React, { useState } from "react";
import {
  Eye,
  Edit3,
  Trash2,
  AlertCircle,
  Calendar,
  User,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
} from "lucide-react";

const MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const splitDate = (dateString) => {
  if (!dateString) return null;
  try {
    const [year, month, day] = dateString.split("-");
    const mIdx = parseInt(month, 10) - 1;
    return {
      day: parseInt(day, 10),
      month: MONTHS_SHORT[mIdx] || month,
      year,
    };
  } catch (e) {
    return null;
  }
};

const CATEGORY_STYLE = {
  อบรม: {
    dot: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    accent: "from-indigo-500 to-blue-600",
    glow: "group-hover:shadow-indigo-500/10",
  },
  สัมมนา: {
    dot: "bg-purple-500",
    badge: "bg-purple-50 text-purple-700 border-purple-200/80",
    accent: "from-purple-500 to-pink-600",
    glow: "group-hover:shadow-purple-500/10",
  },
  จิตอาสา: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    accent: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-emerald-500/10",
  },
};

const FALLBACK_STYLE = {
  dot: "bg-slate-400",
  badge: "bg-slate-50 text-slate-700 border-slate-200",
  accent: "from-slate-500 to-slate-700",
  glow: "group-hover:shadow-slate-500/10",
};

export default function EventTable({
  events,
  onView,
  onEdit,
  onDelete,
  isLoading,
}) {
  const [viewMode, setViewMode] = useState("grid");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
          <span className="inline-block animate-spin w-6 h-6 border-3 border-teal-600 border-t-transparent rounded-full mr-3" />
          <span className="text-slate-600 font-medium">
            กำลังโหลดรายการกิจกรรม...
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse shadow-sm"
            >
              <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
              <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
              <div className="h-20 bg-slate-100 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-14 text-center shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-teal-50/50">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          ไม่พบข้อมูลกิจกรรม
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          ไม่พบรายการกิจกรรมตามเงื่อนไขที่ค้นหา หรือยังไม่มีกิจกรรมในระบบ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Control Switcher Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
          <span>
            แสดงทั้งหมด{" "}
            <strong className="text-slate-900 font-bold">
              {events.length}
            </strong>{" "}
            รายการ
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-white text-teal-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> การ์ด
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "table"
                ? "bg-white text-teal-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" /> ตาราง
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isPublished = Boolean(event.status);
            const cat = CATEGORY_STYLE[event.category] || FALLBACK_STYLE;
            const d = splitDate(event.eventDate);

            return (
              <div
                key={event.id}
                className={`group bg-white rounded-3xl border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-2xl ${cat.glow} hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden relative`}
              >
                {/* Top Accent Line */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${cat.accent}`}
                />

                {/* Badge Header */}
                <div className="p-6 pb-3 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${cat.badge}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                    {event.category}
                  </span>

                  {isPublished ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      เผยแพร่
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-500 bg-slate-100 rounded-full border border-slate-200">
                      ฉบับร่าง
                    </span>
                  )}
                </div>

                {/* Title & Desc */}
                <div className="px-6 flex-1 space-y-2">
                  <h3
                    onClick={() => onView(event)}
                    className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Info Card Pill */}
                <div className="p-6 pt-4 space-y-3">
                  <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-100 space-y-2">
                    <div className="flex items-center text-xs text-slate-600 gap-2.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {d ? `${d.day} ${d.month} ${d.year}` : "-"}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-600 gap-2.5">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{event.organizer}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onView(event)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 group/btn"
                    >
                      <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      ดูรายละเอียด
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
                        title="แก้ไข"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(event)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 pl-6 pr-3">วันที่</th>
                  <th className="py-4 px-3">กิจกรรม</th>
                  <th className="py-4 px-3">ผู้จัด</th>
                  <th className="py-4 px-3">หมวดหมู่</th>
                  <th className="py-4 px-3 text-center">สถานะ</th>
                  <th className="py-4 pl-3 pr-6 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {events.map((event) => {
                  const isPublished = Boolean(event.status);
                  const cat = CATEGORY_STYLE[event.category] || FALLBACK_STYLE;
                  const d = splitDate(event.eventDate);

                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 pl-6 pr-3 text-xs font-bold text-slate-800 whitespace-nowrap">
                        {d ? `${d.day} ${d.month} ${d.year}` : "-"}
                      </td>
                      <td className="py-4 px-3">
                        <div
                          className="font-bold text-slate-900 hover:text-teal-700 cursor-pointer line-clamp-1"
                          onClick={() => onView(event)}
                        >
                          {event.title}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-xs text-slate-600">
                        {event.organizer}
                      </td>
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${cat.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cat.dot}`}
                          />
                          {event.category}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {isPublished ? (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            เผยแพร่
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            ฉบับร่าง
                          </span>
                        )}
                      </td>
                      <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onView(event)}
                            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(event)}
                            className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(event)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
        </div>
      )}
    </div>
  );
}
