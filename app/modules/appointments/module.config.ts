import type { ModuleConfig } from "~/shared/types/module-contract";
import { AppointmentsIcon } from "./components/AppointmentsIcon";

export const moduleConfig: ModuleConfig = {
  id: "appointments",
  label: "Appointments",
  href: "appointments",
  icon: AppointmentsIcon,
  permission: "appointments:read",
  order: 10,
  description: "Manage patient appointments and schedules",
};
