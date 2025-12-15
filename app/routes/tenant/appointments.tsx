export function meta() {
  return [
    { title: "Appointments - Hospital Management" },
    { name: "description", content: "Manage patient appointments" },
  ];
}

export default function Appointments() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="mt-2 text-gray-600">Manage patient appointments and schedules</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Today's Appointments</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No appointments scheduled for today.</p>
        </div>
      </div>
    </div>
  );
}