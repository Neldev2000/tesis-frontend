import { Badge } from "~/shared/components";
import type { AppointmentStatus } from "../types";

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    variant: "default" | "primary" | "success" | "warning" | "danger" | "info";
    style: "ghost" | "outline" | "soft" | "solid";
    dot?: boolean;
    pulse?: boolean;
  }
> = {
  requested: {
    label: "Solicitada",
    variant: "warning",
    style: "ghost",
    dot: true,
  },
  confirmed: {
    label: "Confirmada",
    variant: "success",
    style: "ghost",
    dot: true,
  },
  in_progress: {
    label: "En Progreso",
    variant: "info",
    style: "soft",
    dot: true,
    pulse: true,
  },
  completed: {
    label: "Completada",
    variant: "success",
    style: "outline",
  },
  cancelled: {
    label: "Cancelada",
    variant: "default",
    style: "outline",
  },
  rescheduled: {
    label: "Reprogramada",
    variant: "warning",
    style: "outline",
  },
  no_show: {
    label: "No Asistió",
    variant: "danger",
    style: "ghost",
  },
};

export function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const config = statusConfig[status];
  return (
    <Badge
      variant={config.variant}
      style={config.style}
      dot={config.dot}
      pulse={config.pulse}
      size="sm"
    >
      {config.label}
    </Badge>
  );
}
