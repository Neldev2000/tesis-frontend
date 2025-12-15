import { Outlet, useParams } from "react-router";
import { TenantLayout } from "~/shared/components";
import type { UserProfile, Hospital } from "~/shared/types";

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

export default function TenantLayoutRoute() {
  const { tenantId } = useParams();

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
    >
      <Outlet />
    </TenantLayout>
  );
}