export function meta() {
  return [
    { title: "Inventory - Hospital Management" },
    { name: "description", content: "Manage medical supplies and equipment" },
  ];
}

export default function Inventory() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-2 text-gray-600">Manage medical supplies and equipment</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Current Stock</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No inventory items found. Start by adding medical supplies and equipment.</p>
        </div>
      </div>
    </div>
  );
}