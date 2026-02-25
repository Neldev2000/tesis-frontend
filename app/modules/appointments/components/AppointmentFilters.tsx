import { SearchInput, Select, DateInput, Button } from "~/shared/components";
import type { SelectOption } from "~/shared/components";
import { useAppointmentsStore } from "../stores";
import { useDoctors, useSpecialties } from "../hooks";

const statusOptions: SelectOption[] = [
  { value: "all", label: "Todos los estados" },
  { value: "requested", label: "Solicitada" },
  { value: "confirmed", label: "Confirmada" },
  { value: "in_progress", label: "En Progreso" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "rescheduled", label: "Reprogramada" },
  { value: "no_show", label: "No Asistió" },
];

export function AppointmentFilters() {
  const { filters, setFilters, resetFilters } = useAppointmentsStore();
  const { data: doctors } = useDoctors();
  const { data: specialties } = useSpecialties();

  const doctorOptions: SelectOption[] = [
    { value: "all", label: "Todos los doctores" },
    ...doctors.map((d) => ({ value: d.id, label: d.full_name })),
  ];

  const specialtyOptions: SelectOption[] = [
    { value: "all", label: "Todas las especialidades" },
    ...specialties.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-full sm:w-48">
        <SearchInput
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          onClear={() => setFilters({ search: "" })}
          placeholder="Buscar paciente..."
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(val) => setFilters({ status: val as typeof filters.status })}
          selectSize="md"
        />
      </div>
      <div className="w-full sm:w-44">
        <Select
          options={doctorOptions}
          value={filters.doctor_id}
          onChange={(val) =>
            setFilters({ doctor_id: val as typeof filters.doctor_id })
          }
          selectSize="md"
        />
      </div>
      <div className="w-full sm:w-44">
        <Select
          options={specialtyOptions}
          value={filters.specialty_id}
          onChange={(val) =>
            setFilters({ specialty_id: val as typeof filters.specialty_id })
          }
          selectSize="md"
        />
      </div>
      <div className="w-full sm:w-36">
        <DateInput
          value={filters.date_from}
          onChange={(e) => setFilters({ date_from: e.target.value })}
          inputSize="md"
        />
      </div>
      <div className="w-full sm:w-36">
        <DateInput
          value={filters.date_to}
          onChange={(e) => setFilters({ date_to: e.target.value })}
          inputSize="md"
        />
      </div>
      <Button variant="ghost" size="sm" onClick={resetFilters}>
        Limpiar
      </Button>
    </div>
  );
}
