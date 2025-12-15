import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("login", "routes/auth/login.tsx"),
  
  // Hospital selection route  
  route("hospitals", "routes/hospitals/index.tsx"),
  
  // Tenant-specific routes with layout
  route(":tenantId", "routes/tenant/layout.tsx", [
    index("routes/tenant/dashboard.tsx"),
    route("appointments", "routes/tenant/appointments.tsx"),
    route("inventory", "routes/tenant/inventory.tsx"),
    route("patients", "routes/tenant/patients.tsx"),
  ]),
] satisfies RouteConfig;
