import { useState } from "react";
import { Link } from "react-router";
import { Card, Badge, SearchInput, Button } from "~/shared/components";

export function meta() {
  return [
    { title: "Select Hospital - Hospital Management" },
    { name: "description", content: "Select a hospital to manage" },
  ];
}

interface Hospital {
  id: string;
  name: string;
  slug: string;
  location: string;
  beds: number;
  patients: number;
  status: "active" | "maintenance";
}

const hospitals: Hospital[] = [
  {
    id: "hospital-1",
    name: "General Hospital",
    slug: "general-hospital",
    location: "Downtown Medical District",
    beds: 450,
    patients: 312,
    status: "active",
  },
  {
    id: "hospital-2",
    name: "St. Mary's Medical Center",
    slug: "st-marys",
    location: "Westside Campus",
    beds: 320,
    patients: 245,
    status: "active",
  },
  {
    id: "hospital-3",
    name: "City Children's Hospital",
    slug: "city-childrens",
    location: "Pediatric Complex",
    beds: 180,
    patients: 98,
    status: "active",
  },
  {
    id: "hospital-4",
    name: "Regional Trauma Center",
    slug: "regional-trauma",
    location: "Emergency Services Hub",
    beds: 275,
    patients: 0,
    status: "maintenance",
  },
];

export default function Hospitals() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-900">Select Hospital</h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose a facility to access its dashboard
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
          />
        </div>

        {/* Hospital List */}
        <div className="space-y-2">
          {filteredHospitals.length === 0 ? (
            <Card variant="default" padding="lg">
              <div className="text-center py-4">
                <p className="text-sm text-slate-500">No hospitals found</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              </div>
            </Card>
          ) : (
            filteredHospitals.map((hospital) => (
              <Link key={hospital.id} to={`/${hospital.slug}`} className="block group">
                <Card variant="default" padding="none" hover>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-medium text-slate-900 group-hover:text-viking-600 transition-colors">
                          {hospital.name}
                        </h3>
                        {hospital.status === "maintenance" && (
                          <Badge variant="warning" className="text-[10px]">
                            Maintenance
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {hospital.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <div className="text-right">
                        <span className="text-slate-900 font-medium tabular-nums">{hospital.patients}</span>
                        <span className="text-slate-400 ml-1">patients</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-900 font-medium tabular-nums">{hospital.beds}</span>
                        <span className="text-slate-400 ml-1">beds</span>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-300 group-hover:text-viking-500 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 text-center mt-8">
          Need access to another hospital? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
