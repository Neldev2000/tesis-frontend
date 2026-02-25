import { useState } from "react";
import { Dialog, Button, Avatar, Badge, Textarea } from "~/shared/components";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { AppointmentTypeBadge } from "./AppointmentTypeBadge";
import type { Appointment, AppointmentStatus } from "../types";

interface AppointmentDetailDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: AppointmentStatus) => void;
}

const roleLabels: Record<string, string> = {
  worker: "Trabajador",
  professor: "Profesor",
  student: "Estudiante",
  family_member: "Familiar",
};

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-VE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDuration(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

const statusLabels: Record<AppointmentStatus, string> = {
  requested: "Solicitada",
  confirmed: "Confirmada",
  in_progress: "En Progreso",
  completed: "Completada",
  cancelled: "Cancelada",
  rescheduled: "Reprogramada",
  no_show: "No Asistió",
};

const statusFlow: AppointmentStatus[] = [
  "requested",
  "confirmed",
  "in_progress",
  "completed",
];

function getStepState(
  currentStatus: AppointmentStatus,
  stepIndex: number
): "done" | "current" | "terminal" | "pending" {
  if (currentStatus === "cancelled") {
    return stepIndex < 1 ? "done" : stepIndex === 1 ? "terminal" : "pending";
  }
  if (currentStatus === "no_show") {
    return stepIndex < 2 ? "done" : stepIndex === 2 ? "terminal" : "pending";
  }
  if (currentStatus === "rescheduled") {
    return stepIndex === 0 ? "done" : stepIndex === 1 ? "current" : "pending";
  }
  const currentIdx = statusFlow.indexOf(currentStatus);
  if (stepIndex < currentIdx) return "done";
  if (stepIndex === currentIdx) return "current";
  return "pending";
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right ml-4">
        {value}
      </span>
    </div>
  );
}

export function AppointmentDetailDialog({
  appointment,
  open,
  onClose,
  onStatusChange,
}: AppointmentDetailDialogProps) {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  if (!appointment) return null;

  const { patient, doctor, specialty } = appointment;
  const duration = getDuration(
    appointment.scheduled_start_time,
    appointment.scheduled_end_time
  );

  function handleStatusChange(newStatus: AppointmentStatus) {
    onStatusChange?.(appointment!.id, newStatus);
    setShowCancelForm(false);
    setCancellationReason("");
  }

  return (
    <Dialog open={open} onClose={onClose} className="sm:max-w-md">
      {/* Header: status + time prominently */}
      <Dialog.Header>
        <Dialog.Title>
          <div className="flex items-center gap-2">
            <AppointmentStatusBadge status={appointment.status} />
            <span className="text-xs font-mono text-slate-400">
              {appointment.id.toUpperCase()}
            </span>
          </div>
        </Dialog.Title>
        <Dialog.Description>
          <span className="tabular-nums font-medium text-slate-700">
            {appointment.scheduled_start_time} - {appointment.scheduled_end_time}
          </span>
          {" · "}
          {formatDateShort(appointment.scheduled_date)}
          {" · "}
          {duration} min
        </Dialog.Description>
      </Dialog.Header>

      <Dialog.Body>
        <div className="space-y-4">
          {/* ── Patient Card ── */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                alt={`${patient?.first_name} ${patient?.first_lastname}`}
                size="md"
                initials={patient?.initials ?? "?"}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {patient?.first_name}{" "}
                  {patient?.second_name ? patient.second_name + " " : ""}
                  {patient?.first_lastname}{" "}
                  {patient?.second_lastname ?? ""}
                </p>
                <Badge variant="default" style="outline" size="xs">
                  {roleLabels[patient?.role ?? "worker"]}
                </Badge>
              </div>
            </div>
            <div className="divide-y divide-slate-200/60">
              <InfoRow label="Cédula" value={patient?.ci} />
              <InfoRow
                label="NHM"
                value={
                  <span className="font-mono tracking-wider text-viking-700">
                    {patient?.nhm}
                  </span>
                }
              />
              <InfoRow label="Email" value={patient?.email} />
              <InfoRow label="Teléfono" value={patient?.cellphone} />
            </div>
          </div>

          {/* ── Appointment Info ── */}
          <div className="divide-y divide-slate-100">
            <InfoRow label="Especialidad" value={specialty?.name} />
            <InfoRow
              label="Doctor"
              value={
                <span>
                  {doctor?.full_name}{" "}
                  <span className="text-xs text-slate-400">
                    ({doctor?.doctor_code})
                  </span>
                </span>
              }
            />
            <InfoRow
              label="Tipo"
              value={
                <AppointmentTypeBadge type={appointment.appointment_type} />
              }
            />
            {appointment.reason && (
              <div className="py-1.5">
                <p className="text-xs text-slate-500 mb-0.5">Motivo</p>
                <p className="text-sm text-slate-700">{appointment.reason}</p>
              </div>
            )}
          </div>

          {/* ── Cancellation reason ── */}
          {appointment.cancellation_reason && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs text-red-500 font-medium mb-1">
                Razón de cancelación
              </p>
              <p className="text-sm text-red-700">
                {appointment.cancellation_reason}
              </p>
            </div>
          )}

          {/* ── Progress: vertical timeline ── */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Progreso
            </p>
            <div className="flex flex-col gap-0">
              {statusFlow.map((s, i) => {
                const state = getStepState(appointment.status, i);
                const label =
                  state === "terminal"
                    ? statusLabels[appointment.status]
                    : statusLabels[s];
                const isLast = i === statusFlow.length - 1;

                return (
                  <div key={s} className="flex gap-3">
                    {/* Dot + line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          state === "done"
                            ? "bg-viking-600"
                            : state === "current"
                              ? "bg-viking-500"
                              : state === "terminal"
                                ? "bg-red-500"
                                : "bg-slate-200"
                        }`}
                      >
                        {state === "done" ? (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : state === "terminal" ? (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        ) : state === "current" ? (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        ) : null}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-4 ${
                            state === "done" ? "bg-viking-300" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    {/* Label */}
                    <p
                      className={`text-sm pt-0.5 ${
                        state === "done"
                          ? "text-slate-500"
                          : state === "current"
                            ? "text-viking-700 font-semibold"
                            : state === "terminal"
                              ? "text-red-600 font-semibold"
                              : "text-slate-400"
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Cancel Form ── */}
          {showCancelForm && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm font-medium text-red-800 mb-2">
                Razón de cancelación
              </p>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Ingrese el motivo de la cancelación..."
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={!cancellationReason.trim()}
                >
                  Confirmar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCancelForm(false);
                    setCancellationReason("");
                  }}
                >
                  Volver
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog.Body>

      <Dialog.Footer>
        {!showCancelForm && (
          <div className="flex flex-wrap gap-2 w-full">
            {appointment.status === "requested" && (
              <>
                <Button variant="success" size="sm" onClick={() => handleStatusChange("confirmed")}>
                  Confirmar
                </Button>
                <Button variant="danger" size="sm" onClick={() => setShowCancelForm(true)}>
                  Cancelar
                </Button>
              </>
            )}
            {appointment.status === "confirmed" && (
              <>
                <Button variant="primary" size="sm" onClick={() => handleStatusChange("in_progress")}>
                  Iniciar Consulta
                </Button>
                <Button variant="soft" size="sm" onClick={() => handleStatusChange("rescheduled")}>
                  Reprogramar
                </Button>
                <Button variant="danger" size="sm" onClick={() => setShowCancelForm(true)}>
                  Cancelar
                </Button>
              </>
            )}
            {appointment.status === "in_progress" && (
              <>
                <Button variant="success" size="sm" onClick={() => handleStatusChange("completed")}>
                  Completar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleStatusChange("no_show")}>
                  No Asistió
                </Button>
              </>
            )}
            <div className="flex-1" />
            <Dialog.Button variant="secondary" onClick={onClose}>
              Cerrar
            </Dialog.Button>
          </div>
        )}
      </Dialog.Footer>
    </Dialog>
  );
}
