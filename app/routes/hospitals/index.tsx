import { Link } from "react-router";

export function meta() {
  return [
    { title: "Select Hospital - Hospital Management" },
    { name: "description", content: "Select a hospital to manage" },
  ];
}

const hospitals = [
  { id: "hospital-1", name: "General Hospital", slug: "general-hospital" },
  { id: "hospital-2", name: "St. Mary's Medical Center", slug: "st-marys" },
  { id: "hospital-3", name: "City Children's Hospital", slug: "city-childrens" },
];

export default function Hospitals() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Select Hospital
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose a hospital to access its management system
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital) => (
            <Link
              key={hospital.id}
              to={`/${hospital.slug}`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {hospital.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Access management dashboard
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Active
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}