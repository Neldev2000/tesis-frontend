import type { ModuleConfig } from "~/shared/types/module-contract";
import { TemplateIcon } from "./components/TemplateIcon";

/**
 * TODO: Replace all "template" references with your module name.
 *
 * After creating your module:
 * 1. Register it in app/modules/registry.ts
 * 2. Create a route file at app/routes/tenant/<your-module>.tsx
 * 3. Add the route to app/routes.ts
 */
export const moduleConfig: ModuleConfig = {
  id: "template",
  label: "Template",
  href: "template",
  icon: TemplateIcon,
  permission: "template:read",
  order: 99,
  description: "Short description of what this module does",
};
