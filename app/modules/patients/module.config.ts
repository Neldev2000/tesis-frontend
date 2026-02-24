import type { ModuleConfig } from "~/shared/types/module-contract";
import { PatientsIcon } from "./components/PatientsIcon";

export const moduleConfig: ModuleConfig = {
  id: "patients",
  label: "Patient Data",
  href: "patients",
  icon: PatientsIcon,
  permission: "patients:read",
  order: 20,
  description: "Manage patient records and medical history",
};
