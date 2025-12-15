import { Link, useParams } from "react-router";

export function meta() {
  return [
    { title: "Dashboard - Hospital Management" },
    { name: "description", content: "Hospital management dashboard" },
  ];
}

export default function Dashboard() {
  const { tenantId } = useParams();

  const modules = [
    {
      name: "Inventory",
      description: "Manage medical supplies and equipment",
      href: "inventory",
      icon: "📦",
    },
    {
      name: "Appointments",
      description: "Schedule and manage patient appointments",
      href: "appointments", 
      icon: "📅",
    },
    {
      name: "Patients",
      description: "Patient records and medical history",
      href: "patients",
      icon: "👥",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to {tenantId} Hospital Management System</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.name}
            to={module.href}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{module.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {module.name}
            </h3>
            <p className="text-gray-600">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}