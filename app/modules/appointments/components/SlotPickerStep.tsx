import { useState, useMemo } from "react";
import { useAvailableSlots } from "../hooks/useAvailableSlots";

interface SlotPickerStepProps {
  doctorId: string | null;
  durationMinutes: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAY_HEADERS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

interface CalendarDay {
  date: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const today = new Date().toISOString().split("T")[0];
  const days: CalendarDay[] = [];

  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthNum = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonthNum + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayOfWeek = new Date(prevYear, prevMonthNum, d).getDay();
    days.push({
      date: dateStr, dayNum: d, isCurrentMonth: false,
      isToday: dateStr === today, isPast: dateStr < today,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayOfWeek = new Date(year, month, d).getDay();
    days.push({
      date: dateStr, dayNum: d, isCurrentMonth: true,
      isToday: dateStr === today, isPast: dateStr < today,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const nextMonthNum = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonthNum + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayOfWeek = new Date(nextYear, nextMonthNum, d).getDay();
      days.push({
        date: dateStr, dayNum: d, isCurrentMonth: false,
        isToday: dateStr === today, isPast: dateStr < today,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }
  }

  return days;
}

function computeEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const total = h * 60 + m + durationMinutes;
  const eh = Math.floor(total / 60);
  const em = total % 60;
  return `${eh.toString().padStart(2, "0")}:${em.toString().padStart(2, "0")}`;
}

function formatSelectedDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function SlotPickerStep({
  doctorId,
  durationMinutes,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: SlotPickerStepProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const { slots, blocked, block_reason } = useAvailableSlots(
    doctorId,
    selectedDate,
    durationMinutes
  );

  const availableSlots = slots.filter((s) => s.available);

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function goToToday() {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onSelectDate(today.toISOString().split("T")[0]);
  }

  const canGoPrev =
    viewYear > now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  const maxDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);
  const canGoNext =
    new Date(viewYear, viewMonth + 1, 1).getTime() < maxDate.getTime();

  const hasSlots = selectedDate && !blocked && slots.length > 0;

  /* ── Calendar Widget ── */
  const calendarWidget = (
    <div className="bg-white border border-slate-200 rounded-xl p-3">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            onClick={goToToday}
            className="text-[10px] font-medium text-viking-600 hover:text-viking-700 bg-viking-50 hover:bg-viking-100 px-1.5 py-0.5 rounded transition-colors"
          >
            Hoy
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold text-slate-400 uppercase py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const isSelected = selectedDate === day.date;
          const isDisabled = day.isPast || day.isWeekend || !day.isCurrentMonth;

          return (
            <button
              key={day.date}
              onClick={() => !isDisabled && onSelectDate(day.date)}
              disabled={isDisabled}
              className={`
                relative h-8 w-full text-xs font-medium rounded-lg transition-all
                ${isSelected
                  ? "bg-viking-600 text-white shadow-sm"
                  : day.isToday && !isDisabled
                    ? "bg-viking-50 text-viking-700 font-bold hover:bg-viking-100"
                    : isDisabled
                      ? "text-slate-200 cursor-not-allowed"
                      : !day.isCurrentMonth
                        ? "text-slate-300"
                        : "text-slate-700 hover:bg-slate-100"
                }
              `}
            >
              {day.dayNum}
              {day.isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-viking-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ── Slots Panel (vertical list, right side) ── */
  const slotsPanel = (
    <div className="flex flex-col">
      <p className="text-xs font-medium text-slate-600 capitalize mb-2">
        {formatSelectedDate(selectedDate!)}
      </p>
      <p className="text-[11px] text-slate-400 mb-2">
        {availableSlots.length} horario{availableSlots.length !== 1 ? "s" : ""} disponible{availableSlots.length !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px] custom-scrollbar-subtle">
        {slots.map((slot) => {
          const isSlotSelected = selectedTime === slot.time;
          const endTime = computeEndTime(slot.time, durationMinutes);
          return (
            <button
              key={slot.time}
              onClick={() => slot.available && onSelectTime(slot.time)}
              disabled={!slot.available}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium tabular-nums transition-all text-center ${
                isSlotSelected
                  ? "bg-viking-600 text-white shadow-sm"
                  : slot.available
                    ? "bg-white border border-viking-200 text-viking-700 hover:bg-viking-50 hover:border-viking-400"
                    : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed line-through"
              }`}
            >
              {slot.time} – {endTime}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ── Status message when date selected but no slots ── */
  const noSlotsMessage = selectedDate ? (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-600 capitalize">
        {formatSelectedDate(selectedDate)}
      </p>
      {blocked ? (
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Doctor no disponible</p>
            <p className="text-xs text-red-500">{block_reason}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">No hay horarios disponibles</p>
            <p className="text-xs text-slate-400">Seleccione otro día en el calendario</p>
          </div>
        </div>
      )}
    </div>
  ) : null;

  /* ── Layout ── */

  // Side-by-side when there are slots to show
  if (hasSlots) {
    return (
      <div className="flex gap-5">
        <div className="flex-1 min-w-0">{calendarWidget}</div>
        <div className="w-[180px] flex-shrink-0">{slotsPanel}</div>
      </div>
    );
  }

  // Stacked when no slots or no date selected
  return (
    <div className="space-y-3">
      {calendarWidget}
      {noSlotsMessage}
      {!selectedDate && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">
            Seleccione un día en el calendario
          </p>
        </div>
      )}
    </div>
  );
}
