import { useState, useCallback, type ReactNode } from "react";
import { Outlet, useParams, useNavigate } from "react-router";
import { TenantLayout } from "~/shared/components";
import type { UserProfile, Hospital } from "~/shared/types";

// Search category icons
const searchIcons: Record<string, ReactNode> = {
  Patients: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  Staff: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  Appointments: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  Inventory: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
};

// TODO: Replace with actual user data from auth store
const mockUser: UserProfile = {
  id: "1",
  name: "Dr. Smith",
  role: "Cardiology",
  initials: "DS",
};

// TODO: Replace with actual hospitals from API
const mockHospitals: Hospital[] = [
  { id: "general-hospital", name: "General Hospital" },
  { id: "central-medical", name: "Central Medical Center" },
  { id: "st-mary", name: "St. Mary's Hospital" },
];

// TODO: Replace with actual permissions from auth/RBAC system
const mockPermissions = [
  "appointments:read",
  "patients:read",
  "inventory:read",
];

// Mock recent searches
const mockRecentSearches = [
  { id: "1", title: "John Smith", subtitle: "Patient • MRN: 849201", icon: searchIcons.Patients },
  { id: "2", title: "Appointment Schedule", subtitle: "Today's appointments", icon: searchIcons.Appointments },
  { id: "3", title: "Inventory Report", subtitle: "Medical supplies", icon: searchIcons.Inventory },
];

// Mock search database
const mockSearchData = [
  { id: "p1", title: "John Smith", subtitle: "Patient • MRN: 849201", category: "Patients", href: "patients", icon: searchIcons.Patients },
  { id: "p2", title: "Sarah Jenkins", subtitle: "Patient • MRN: 849312", category: "Patients", href: "patients", icon: searchIcons.Patients },
  { id: "p3", title: "Michael Chen", subtitle: "Patient • MRN: 849205", category: "Patients", href: "patients", icon: searchIcons.Patients },
  { id: "a1", title: "Dr. Emily Ray", subtitle: "Cardiology • 3 appointments today", category: "Staff", href: "appointments", icon: searchIcons.Staff },
  { id: "a2", title: "Morning Rounds", subtitle: "Appointment • 9:00 AM", category: "Appointments", href: "appointments", icon: searchIcons.Appointments },
  { id: "i1", title: "Surgical Gloves", subtitle: "Inventory • 500 units", category: "Inventory", href: "inventory", icon: searchIcons.Inventory },
  { id: "i2", title: "Syringes 10ml", subtitle: "Inventory • 200 units", category: "Inventory", href: "inventory", icon: searchIcons.Inventory },
];

export default function TenantLayoutRoute() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter search results based on query
  const getSearchCategories = useCallback((query: string) => {
    if (!query.trim()) return [];

    const filtered = mockSearchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
    );

    // Group by category
    const grouped = filtered.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, typeof filtered>
    );

    return Object.entries(grouped).map(([label, results]) => ({
      label,
      results,
    }));
  }, []);

  const handleSearchSelect = useCallback(
    (result: { id: string; href?: string }) => {
      if (result.href && tenantId) {
        navigate(`/${tenantId}/${result.href}`);
      }
    },
    [navigate, tenantId]
  );

  if (!tenantId) {
    return null;
  }

  const currentHospital = mockHospitals.find((h) => h.id === tenantId);
  const tenantName = currentHospital?.name ?? tenantId;

  return (
    <TenantLayout
      tenantId={tenantId}
      tenantName={tenantName}
      user={mockUser}
      hospitals={mockHospitals}
      permissions={mockPermissions}
      notificationCount={3}
      searchCategories={getSearchCategories(searchQuery)}
      recentSearches={mockRecentSearches}
      onSearch={setSearchQuery}
      onSearchSelect={handleSearchSelect}
    >
      <Outlet />
    </TenantLayout>
  );
}