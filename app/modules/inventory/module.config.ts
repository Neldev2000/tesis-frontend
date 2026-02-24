import type { ModuleConfig } from "~/shared/types/module-contract";
import { InventoryIcon } from "./components/InventoryIcon";

export const moduleConfig: ModuleConfig = {
  id: "inventory",
  label: "Inventory",
  href: "inventory",
  icon: InventoryIcon,
  permission: "inventory:read",
  order: 30,
  description: "Manage medical supplies and equipment",
};
