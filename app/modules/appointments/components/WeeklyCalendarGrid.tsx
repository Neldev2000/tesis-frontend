import { useMemo } from "react";
import type { Appointment, DoctorSchedule, DoctorBlock } from "../types";
import { CalendarTimeGutter, HOUR_HEIGHT, START_HOUR, END_HOUR } from "./CalendarTimeGutter";
import { DayHeader, CalendarDayBody } from "./CalendarDayColumn";

interface WeeklyCalendarGridProps {
  weekDays: { date: string; dayLabel: string; dayNum: number; isToday: boolean }[];
  schedules: DoctorSchedule[];
  blocks: DoctorBlock[];
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

function getDayOfWeek(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1; // 0=Monday
}

export function WeeklyCalendarGrid({
  weekDays,
  schedules,
  blocks,
  appointments,
  onAppointmentClick,
}: WeeklyCalendarGridProps) {
  const columnData = useMemo(() => {
    return weekDays.map((day) => {
      const dow = getDayOfWeek(day.date);
      const daySchedules = schedules.filter((s) => s.day_of_week === dow);
      const dayBlock = blocks.find(
        (b) => day.date >= b.start_date && day.date <= b.end_date
      ) ?? null;
      const dayAppointments = appointments.filter(
        (a) =>
          a.scheduled_date === day.date &&
          a.status !== "cancelled" &&
          a.status !== "no_show"
      );
      return { ...day, schedules: daySchedules, block: dayBlock, appointments: dayAppointments };
    });
  }, [weekDays, schedules, blocks, appointments]);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Fixed Header Row */}
      <div className="flex border-b border-slate-200">
        {/* Gutter placeholder */}
        <div className="flex-shrink-0 w-14" />
        {/* Day headers */}
        {columnData.map((col) => (
          <div key={col.date} className="flex-1 min-w-0 border-r border-slate-100 last:border-r-0">
            <DayHeader
              dayLabel={col.dayLabel}
              dayNum={col.dayNum}
              isToday={col.isToday}
            />
          </div>
        ))}
      </div>

      {/* Scrollable Body */}
      <div
        className="flex overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {/* Time Gutter */}
        <div className="flex-shrink-0">
          <CalendarTimeGutter />
        </div>

        {/* Day Body Columns */}
        {columnData.map((col) => (
          <CalendarDayBody
            key={col.date}
            date={col.date}
            isToday={col.isToday}
            schedules={col.schedules}
            blocked={col.block}
            appointments={col.appointments}
            onAppointmentClick={onAppointmentClick}
          />
        ))}
      </div>
    </div>
  );
}
