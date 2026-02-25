import type { Appointment, AppointmentStatus } from "../types";

const HOUR_HEIGHT = 60;
const START_HOUR = 7;

interface CalendarAppointmentBlockProps {
  appointment: Appointment;
  onClick?: (appointment: Appointment) => void;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const statusColors: Record<AppointmentStatus, { bg: string; border: string; dot: string }> = {
  requested:   { bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-400" },
  confirmed:   { bg: "bg-viking-50",  border: "border-viking-200",  dot: "bg-viking-500" },
  in_progress: { bg: "bg-blue-50",    border: "border-blue-200",    dot: "bg-blue-500" },
  completed:   { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  cancelled:   { bg: "bg-slate-50",   border: "border-slate-200",   dot: "bg-slate-400" },
  rescheduled: { bg: "bg-orange-50",  border: "border-orange-200",  dot: "bg-orange-400" },
  no_show:     { bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-400" },
};

export function CalendarAppointmentBlock({
  appointment,
  onClick,
}: CalendarAppointmentBlockProps) {
  const startMin = timeToMinutes(appointment.scheduled_start_time);
  const endMin = timeToMinutes(appointment.scheduled_end_time);
  const durationMin = endMin - startMin;

  const topPx = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const heightPx = (durationMin / 60) * HOUR_HEIGHT;
  const isShort = heightPx < 35;

  const colors = statusColors[appointment.status];
  const patientName = appointment.patient
    ? `${appointment.patient.first_name} ${appointment.patient.first_lastname}`
    : "Paciente";

  return (
    <button
      onClick={() => onClick?.(appointment)}
      className={`absolute left-0.5 right-0.5 rounded-md border px-1.5 py-0.5 text-left transition-all hover:shadow-md hover:z-10 cursor-pointer overflow-hidden ${colors.bg} ${colors.border}`}
      style={{
        top: `${topPx}px`,
        height: `${Math.max(heightPx - 2, 18)}px`,
        minHeight: "18px",
      }}
      title={`${patientName}\n${appointment.scheduled_start_time} - ${appointment.scheduled_end_time}\n${appointment.reason ?? ""}`}
    >
      {isShort ? (
        <div className="flex items-center gap-1 h-full">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
          <span className="text-[9px] font-medium text-slate-700 truncate">
            {appointment.scheduled_start_time} {patientName}
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
            <span className="text-[10px] font-medium text-slate-800 truncate">
              {patientName}
            </span>
          </div>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            {appointment.scheduled_start_time} - {appointment.scheduled_end_time}
          </p>
          {heightPx > 55 && appointment.reason && (
            <p className="text-[9px] text-slate-400 truncate mt-0.5">
              {appointment.reason}
            </p>
          )}
        </>
      )}
    </button>
  );
}
