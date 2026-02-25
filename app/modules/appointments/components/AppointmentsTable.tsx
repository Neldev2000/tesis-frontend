import { Table, Avatar, NoDataState } from "~/shared/components";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { AppointmentTypeBadge } from "./AppointmentTypeBadge";
import type { Appointment } from "../types";

interface AppointmentsTableProps {
  appointments: Appointment[];
  isLoading: boolean;
  onSelect: (appointment: Appointment) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-VE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function AppointmentsTable({
  appointments,
  isLoading,
  onSelect,
}: AppointmentsTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <NoDataState
        title="No hay citas"
        description="No se encontraron citas con los filtros seleccionados"
        actionLabel="Limpiar filtros"
      />
    );
  }

  return (
    <Table dense>
      <Table.Header>
        <Table.Row>
          <Table.Head>Fecha / Hora</Table.Head>
          <Table.Head>Paciente</Table.Head>
          <Table.Head>Doctor</Table.Head>
          <Table.Head>Especialidad</Table.Head>
          <Table.Head>Tipo</Table.Head>
          <Table.Head>Estado</Table.Head>
          <Table.Head className="w-8" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {appointments.map((apt) => (
          <Table.Row
            key={apt.id}
            onClick={() => onSelect(apt)}
            className="cursor-pointer"
          >
            <Table.Cell>
              <div>
                <span className="text-sm font-medium text-slate-900 tabular-nums">
                  {apt.scheduled_start_time}
                </span>
                <span className="text-xs text-slate-400 ml-1">
                  - {apt.scheduled_end_time}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {formatDate(apt.scheduled_date)}
              </span>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2.5">
                <Avatar
                  alt={`${apt.patient?.first_name} ${apt.patient?.first_lastname}`}
                  size="sm"
                  initials={apt.patient?.initials ?? "?"}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {apt.patient?.first_name} {apt.patient?.first_lastname}
                  </p>
                  <p className="text-xs text-slate-500">
                    NHM: {apt.patient?.nhm}
                  </p>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-slate-700">
                {apt.doctor?.full_name}
              </span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-slate-600">
                {apt.specialty?.name}
              </span>
            </Table.Cell>
            <Table.Cell>
              <AppointmentTypeBadge type={apt.appointment_type} />
            </Table.Cell>
            <Table.Cell>
              <AppointmentStatusBadge status={apt.status} />
            </Table.Cell>
            <Table.Cell>
              <svg
                className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
