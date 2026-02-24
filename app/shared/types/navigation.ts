import { createElement, type ReactNode } from "react";
import type { ModuleConfig } from "./module-contract";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  /** Permission required to see this item */
  permission?: string;
  /** Badge count for notifications */
  badge?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
}

export interface Hospital {
  id: string;
  name: string;
  logo?: string;
}

export interface NavigationConfig {
  items: NavItem[];
  user: UserProfile;
  tenantId: string;
  tenantName?: string;
}

/** Converts a ModuleConfig to a NavItem for use in the sidebar */
export function moduleToNavItem(mod: ModuleConfig): NavItem {
  return {
    id: mod.id,
    label: mod.label,
    href: mod.href,
    icon: createElement(mod.icon),
    permission: mod.permission,
  };
}
