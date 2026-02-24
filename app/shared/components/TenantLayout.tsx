import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SearchDialog } from "./SearchDialog";
import type { NavItem, UserProfile, Hospital } from "../types/navigation";
import { moduleToNavItem } from "../types/navigation";
import { modules } from "~/modules/registry";

// Dashboard is always present (not a registrable module — it's the tenant home)
const dashboardNavItem: NavItem = {
  id: "dashboard",
  label: "Dashboard",
  href: "",
  icon: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    </svg>
  ),
};

/**
 * Navigation items auto-generated from the module registry.
 * To add a new module to the sidebar, register it in app/modules/registry.ts.
 */
export const defaultNavItems: NavItem[] = [
  dashboardNavItem,
  ...modules.map(moduleToNavItem),
];

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  href?: string;
}

interface SearchCategory {
  label: string;
  results: SearchResult[];
}

interface TenantLayoutProps {
  children: ReactNode;
  tenantId: string;
  tenantName?: string;
  user: UserProfile;
  /** List of hospitals the user has access to */
  hospitals?: Hospital[];
  /** Navigation items - defaults to standard hospital modules */
  navItems?: NavItem[];
  /** User permissions for RBAC filtering */
  permissions?: string[];
  notificationCount?: number;
  /** Search results categories */
  searchCategories?: SearchCategory[];
  /** Recent searches for empty state */
  recentSearches?: SearchResult[];
  /** Called when search query changes */
  onSearch?: (query: string) => void;
  /** Called when a search result is selected */
  onSearchSelect?: (result: SearchResult) => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

/**
 * Filters navigation items based on user permissions.
 * Items without a permission requirement are always shown.
 */
function filterNavItemsByPermissions(
  items: NavItem[],
  permissions?: string[]
): NavItem[] {
  if (!permissions) return items;

  return items.filter(
    (item) => !item.permission || permissions.includes(item.permission)
  );
}

export function TenantLayout({
  children,
  tenantId,
  tenantName,
  user,
  hospitals,
  navItems = defaultNavItems,
  permissions,
  notificationCount,
  searchCategories = [],
  recentSearches = [],
  onSearch,
  onSearchSelect,
  onSettingsClick,
  onNotificationsClick,
  onProfileClick,
}: TenantLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredNavItems = filterNavItemsByPermissions(navItems, permissions);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-snow">
      <Sidebar
        user={user}
        navItems={filteredNavItems}
        tenantId={tenantId}
        tenantName={tenantName}
        hospitals={hospitals}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSettingsClick={onSettingsClick}
        onProfileClick={onProfileClick}
      />

      {/* Main content - responsive margin (matches sidebar w-60) */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <Header
          notificationCount={notificationCount}
          onSearchClick={() => setSearchOpen(true)}
          onNotificationsClick={onNotificationsClick}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Search Dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={onSearch}
        onSelect={onSearchSelect}
        categories={searchCategories}
        recentSearches={recentSearches}
      />
    </div>
  );
}
