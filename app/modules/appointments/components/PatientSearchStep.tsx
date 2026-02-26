import { useState, useMemo } from "react";
import { SearchInput, Avatar, Badge } from "~/shared/components";
import { mockPatients } from "../hooks";
import type { Patient } from "../types";

const roleLabels: Record<string, string> = {
  worker: "Trabajador",
  professor: "Profesor",
  student: "Estudiante",
  family_member: "Familiar",
};

interface PatientSearchStepProps {
  selectedPatient: Patient | null;
  onSelect: (patient: Patient) => void;
}

export function PatientSearchStep({
  selectedPatient,
  onSelect,
}: PatientSearchStepProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return mockPatients;
    const q = search.toLowerCase();
    return mockPatients.filter(
      (p) =>
        `${p.first_name} ${p.first_lastname}`.toLowerCase().includes(q) ||
        p.ci.toLowerCase().includes(q) ||
        p.nhm.includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
        placeholder="Buscar por nombre, CI o NHM..."
      />
      <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar-subtle">
        {filtered.map((patient) => {
          const isSelected = selectedPatient?.id === patient.id;
          return (
            <button
              key={patient.id}
              onClick={() => onSelect(patient)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                isSelected
                  ? "bg-viking-50 border border-viking-500 ring-1 ring-viking-200"
                  : "border border-transparent hover:bg-slate-50"
              }`}
            >
              <Avatar
                alt={`${patient.first_name} ${patient.first_lastname}`}
                size="sm"
                initials={patient.initials}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {patient.first_name} {patient.first_lastname}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-slate-500">{patient.ci}</span>
                  <span className="text-xs text-viking-600 font-mono font-medium">
                    {patient.nhm}
                  </span>
                </div>
              </div>
              <Badge variant="default" style="outline" size="xs">
                {roleLabels[patient.role]}
              </Badge>
              {isSelected && (
                <svg
                  className="w-4 h-4 text-viking-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            No se encontraron pacientes
          </p>
        )}
      </div>
    </div>
  );
}
