import { Badge } from "~/shared/components";
import type { AppointmentType } from "../types";

const typeConfig: Record<
  AppointmentType,
  {
    label: string;
    variant: "primary" | "default";
    style: "ghost" | "outline";
  }
> = {
  first_visit: {
    label: "Primera Vez",
    variant: "primary",
    style: "ghost",
  },
  follow_up: {
    label: "Control",
    variant: "default",
    style: "outline",
  },
};

export function AppointmentTypeBadge({ type }: { type: AppointmentType }) {
  const config = typeConfig[type];
  return (
    <Badge variant={config.variant} style={config.style} size="sm">
      {config.label}
    </Badge>
  );
}
