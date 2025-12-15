export function meta() {
  return [
    { title: "Patients - Hospital Management" },
    { name: "description", content: "Manage patient records and information" },
  ];
}

export default function Patients() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="mt-2 text-gray-600">Manage patient records and medical history</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Patient Records</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No patient records found. Start by registering new patients.</p>
        </div>
      </div>
    </div>
  );
}