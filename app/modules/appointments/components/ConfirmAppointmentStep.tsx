import { Avatar, Badge, Card, Textarea } from "~/shared/components";
import type { Patient, Doctor, Specialty, AppointmentType } from "../types";

interface ConfirmAppointmentStepProps {
  patient: Patient | null;
  doctor: Doctor | null;
  specialty: Specialty | null;
  date: string | null;
  time: string | null;
  appointmentType: AppointmentType;
  durationMinutes: number;
  reason: string;
  onReasonChange: (reason: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function computeEndTime(startTime: string, duration: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMin = h * 60 + m + duration;
  const eh = Math.floor(totalMin / 60);
  const em = totalMin % 60;
  return `${eh.toString().padStart(2, "0")}:${em.toString().padStart(2, "0")}`;
}

export function ConfirmAppointmentStep({
  patient,
  doctor,
  specialty,
  date,
  time,
  appointmentType,
  durationMinutes,
  reason,
  onReasonChange,
}: ConfirmAppointmentStepProps) {
  if (!patient || !doctor || !specialty || !date || !time) return null;

  const endTime = computeEndTime(time, durationMinutes);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card variant="flat" padding="md">
        <div className="space-y-4">
          {/* Patient */}
          <div className="flex items-center gap-3">
            <Avatar
              alt={`${patient.first_name} ${patient.first_lastname}`}
              size="sm"
              initials={patient.initials}
            />
            <div>
              <p className="text-sm font-medium text-slate-900">
                {patient.first_name} {patient.first_lastname}
              </p>
              <p className="text-xs text-slate-500">
                CI: {patient.ci} &middot; NHM: {patient.nhm}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500">Especialidad</p>
              <p className="text-sm font-medium text-slate-900">
                {specialty.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Doctor</p>
              <p className="text-sm font-medium text-slate-900">
                {doctor.full_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Fecha</p>
              <p className="text-sm font-medium text-slate-900">
                {formatDate(date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Hora</p>
              <p className="text-sm font-medium text-slate-900 tabular-nums">
                {time} - {endTime}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Type & Duration */}
          <div className="flex items-center gap-3">
            <Badge
              variant={appointmentType === "first_visit" ? "primary" : "default"}
              style={appointmentType === "first_visit" ? "ghost" : "outline"}
              size="sm"
            >
              {appointmentType === "first_visit" ? "Primera Vez" : "Control"}
            </Badge>
            <span className="text-xs text-slate-500">
              Duración: {durationMinutes} min
            </span>
          </div>
        </div>
      </Card>

      {/* Reason */}
      <Textarea
        label="Motivo de la consulta"
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Describa brevemente el motivo de la consulta..."
        rows={3}
      />
    </div>
  );
}
