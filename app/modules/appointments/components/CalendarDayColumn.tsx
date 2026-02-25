import type { Appointment, DoctorSchedule, DoctorBlock } from "../types";
import { CalendarAppointmentBlock } from "./CalendarAppointmentBlock";

const HOUR_HEIGHT = 60;
const START_HOUR = 7;
const END_HOUR = 18;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

interface DayHeaderProps {
  dayLabel: string;
  dayNum: number;
  isToday: boolean;
}

export function DayHeader({ dayLabel, dayNum, isToday }: DayHeaderProps) {
  return (
    <div className={`text-center py-2 ${isToday ? "bg-viking-50" : ""}`}>
      <p className="text-[10px] font-medium text-slate-400 uppercase">{dayLabel}</p>
      <div className="flex justify-center">
        <span
          className={`text-sm font-semibold tabular-nums leading-7 ${
            isToday
              ? "text-white bg-viking-600 w-7 h-7 rounded-full inline-flex items-center justify-center"
              : "text-slate-700"
          }`}
        >
          {dayNum}
        </span>
      </div>
    </div>
  );
}

interface CalendarDayColumnProps {
  date: string;
  isToday: boolean;
  schedules: DoctorSchedule[];
  blocked: DoctorBlock | null;
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

function timeToPixels(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return ((h * 60 + m - START_HOUR * 60) / 60) * HOUR_HEIGHT;
}

export function CalendarDayBody({
  date,
  isToday,
  schedules,
  blocked,
  appointments,
  onAppointmentClick,
}: CalendarDayColumnProps) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const showNowLine = isToday && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;
  const nowTop = ((nowMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;

  return (
    <div className="relative border-r border-slate-100 flex-1 min-w-0" style={{ height: TOTAL_HEIGHT }}>
      {/* Hour grid lines */}
      {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-slate-100"
          style={{ top: i * HOUR_HEIGHT }}
        />
      ))}

      {/* Half-hour grid lines */}
      {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
        <div
          key={`half-${i}`}
          className="absolute left-0 right-0 border-t border-dashed border-slate-50"
          style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
        />
      ))}

      {/* Schedule blocks (available time backgrounds) */}
      {!blocked &&
        schedules.map((schedule) => {
          const top = timeToPixels(schedule.start_time);
          const bottom = timeToPixels(schedule.end_time);
          return (
            <div
              key={schedule.id}
              className="absolute left-0 right-0 bg-viking-50/40"
              style={{ top: `${top}px`, height: `${bottom - top}px` }}
            />
          );
        })}

      {/* Blocked day overlay */}
      {blocked && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(239,68,68,0.04) 8px, rgba(239,68,68,0.04) 16px)",
          }}
        >
          <div className="bg-white/90 rounded-lg px-2 py-1 text-center">
            <p className="text-[10px] font-medium text-red-500">Bloqueado</p>
            <p className="text-[9px] text-red-400">{blocked.reason}</p>
          </div>
        </div>
      )}

      {/* Appointment blocks */}
      {appointments.map((apt) => (
        <CalendarAppointmentBlock
          key={apt.id}
          appointment={apt}
          onClick={onAppointmentClick}
        />
      ))}

      {/* Now line */}
      {showNowLine && (
        <div
          className="absolute left-0 right-0 z-20 pointer-events-none"
          style={{ top: `${nowTop}px` }}
        >
          <div className="relative">
            <div className="absolute -left-1 -top-[3px] w-2 h-2 rounded-full bg-red-500" />
            <div className="h-[2px] bg-red-500" />
          </div>
        </div>
      )}
    </div>
  );
}
