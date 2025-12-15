import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SearchDialog } from "./SearchDialog";
import type { NavItem, UserProfile, Hospital } from "../types/navigation";

// Default navigation icons
const icons = {
  dashboard: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    </svg>
  ),
  appointments: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
      />
    </svg>
  ),
  patients: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  ),
  inventory: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  ),
  staff: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  ),
};

/** Default navigation items for the tenant layout */
export const defaultNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "",
    icon: icons.dashboard,
  },
  {
    id: "appointments",
    label: "Appointments",
    href: "appointments",
    icon: icons.appointments,
    permission: "appointments:read",
  },
  {
    id: "patients",
    label: "Patient Data",
    href: "patients",
    icon: icons.patients,
    permission: "patients:read",
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "inventory",
    icon: icons.inventory,
    permission: "inventory:read",
  },
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

      {/* Main content - responsive margin */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
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
