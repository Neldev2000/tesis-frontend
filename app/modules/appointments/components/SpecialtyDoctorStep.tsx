import { Select, Avatar, Badge } from "~/shared/components";
import type { SelectOption } from "~/shared/components";
import { useSpecialties, useDoctors } from "../hooks";
import type { Doctor, Specialty } from "../types";

interface SpecialtyDoctorStepProps {
  selectedSpecialtyId: string | null;
  selectedDoctor: Doctor | null;
  onSelectSpecialty: (id: string, specialty: Specialty) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  isFirstVisit: boolean;
}

export function SpecialtyDoctorStep({
  selectedSpecialtyId,
  selectedDoctor,
  onSelectSpecialty,
  onSelectDoctor,
  isFirstVisit,
}: SpecialtyDoctorStepProps) {
  const { data: specialties } = useSpecialties();
  const { data: doctors } = useDoctors(selectedSpecialtyId ?? undefined);

  const specialtyOptions: SelectOption[] = [
    { value: "", label: "Seleccione una especialidad" },
    ...specialties.map((s) => ({ value: s.id, label: s.name })),
  ];

  const selectedSpecialty = specialties.find(
    (s) => s.id === selectedSpecialtyId
  );
  const duration = selectedSpecialty
    ? isFirstVisit
      ? selectedSpecialty.default_first_visit_duration
      : selectedSpecialty.default_follow_up_duration
    : null;

  return (
    <div className="space-y-4">
      <Select
        label="Especialidad"
        options={specialtyOptions}
        value={selectedSpecialtyId ?? ""}
        onChange={(val) => {
          const spec = specialties.find((s) => s.id === val);
          if (spec) onSelectSpecialty(val, spec);
        }}
        selectSize="md"
      />

      {selectedSpecialtyId && (
        <>
          {/* Auto-detection indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
            <Badge
              variant={isFirstVisit ? "primary" : "default"}
              style={isFirstVisit ? "ghost" : "outline"}
              size="sm"
            >
              {isFirstVisit ? "Primera Vez" : "Control"}
            </Badge>
            <span className="text-xs text-slate-500">
              {isFirstVisit
                ? "El paciente no tiene consultas previas en esta especialidad"
                : "El paciente tiene historial en esta especialidad"}
            </span>
          </div>

          {duration && (
            <p className="text-xs text-slate-500">
              Duración estimada: <span className="font-medium">{duration} min</span>
            </p>
          )}

          {/* Doctor Cards */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Doctores Disponibles
            </p>
            <div className="space-y-1.5">
              {doctors.map((doctor) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                return (
                  <button
                    key={doctor.id}
                    onClick={() => onSelectDoctor(doctor)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isSelected
                        ? "bg-viking-50 border border-viking-500 ring-1 ring-viking-200"
                        : "border border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <Avatar
                      alt={doctor.full_name}
                      size="sm"
                      initials={doctor.initials}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {doctor.full_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {doctor.doctor_code} &middot;{" "}
                        {doctor.doctor_type === "general"
                          ? "General"
                          : "Especialista"}
                      </p>
                    </div>
                    {doctor.max_daily_appointments && (
                      <span className="text-xs text-slate-400">
                        Máx. {doctor.max_daily_appointments}/día
                      </span>
                    )}
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
              {doctors.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No hay doctores disponibles para esta especialidad
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
