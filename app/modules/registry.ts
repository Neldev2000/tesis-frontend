/**
 * Module Registry
 *
 * Central registration point for all application modules.
 * When creating a new module, add its config import here.
 *
 * HOW TO REGISTER A NEW MODULE:
 * 1. Create your module folder: app/modules/<name>/
 * 2. Create module.config.ts following the ModuleConfig contract
 * 3. Import and add it to the `modules` array below
 * 4. Create the route file: app/routes/tenant/<name>.tsx
 * 5. Add the route to app/routes.ts
 */

import type { ModuleConfig } from "~/shared/types/module-contract";

import { moduleConfig as appointments } from "./appointments/module.config";
import { moduleConfig as patients } from "./patients/module.config";
import { moduleConfig as inventory } from "./inventory/module.config";

// ──────────────────────────────────────────────
// Add new module imports above this line
// ──────────────────────────────────────────────

/** All registered modules, sorted by `order` (lower = higher in sidebar) */
export const modules: ModuleConfig[] = [
  appointments,
  patients,
  inventory,
  // Add new modules above this line
].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

/** Get a module config by its ID */
export function getModule(id: string): ModuleConfig | undefined {
  return modules.find((m) => m.id === id);
}

/** Get all module permission strings (useful for RBAC setup) */
export function getAllPermissions(): string[] {
  return modules
    .map((m) => m.permission)
    .filter((p): p is string => p !== undefined);
}
