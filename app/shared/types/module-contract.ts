import type { ComponentType } from "react";

/**
 * ModuleConfig — The contract every module must implement.
 *
 * Each module in `app/modules/<name>/` exports a `moduleConfig` object
 * that satisfies this interface. The module registry collects all configs
 * to dynamically build navigation, permissions, and routing metadata.
 *
 * @example
 * // app/modules/billing/module.config.ts
 * import { type ModuleConfig } from "~/shared/types/module-contract";
 * import { BillingIcon } from "./components/BillingIcon";
 *
 * export const moduleConfig: ModuleConfig = {
 *   id: "billing",
 *   label: "Billing",
 *   href: "billing",
 *   icon: BillingIcon,
 *   permission: "billing:read",
 *   order: 40,
 *   description: "Manage invoices and payments",
 * };
 */
export interface ModuleConfig {
  /** Unique module identifier (kebab-case, e.g. "inventory", "lab-results") */
  id: string;

  /** Display label shown in the sidebar navigation */
  label: string;

  /** Route path segment under /:tenantId/ (e.g. "inventory" → /:tenantId/inventory) */
  href: string;

  /**
   * Icon component rendered in the sidebar.
   * Must accept an optional `className` prop for sizing/coloring.
   *
   * @example
   * const MyIcon = ({ className }: { className?: string }) => (
   *   <svg className={className} ...>...</svg>
   * );
   */
  icon: ComponentType<{ className?: string }>;

  /** Permission string required to see this module (e.g. "inventory:read").
   *  If omitted, the module is always visible. */
  permission?: string;

  /** Sort order in sidebar (lower = higher). Defaults to 99. */
  order?: number;

  /** Short description shown in tooltips or module directory */
  description?: string;
}
