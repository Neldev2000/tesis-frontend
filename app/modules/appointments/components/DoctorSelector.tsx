import { Select } from "~/shared/components";
import type { SelectOption } from "~/shared/components";
import { mockDoctors } from "../hooks";

interface DoctorSelectorProps {
  selectedDoctorId: string | null;
  onSelect: (doctorId: string) => void;
}

export function DoctorSelector({
  selectedDoctorId,
  onSelect,
}: DoctorSelectorProps) {
  const options: SelectOption[] = mockDoctors.map((d) => ({
    value: d.id,
    label: `${d.full_name} — ${d.specialty?.name ?? ""}`,
  }));

  return (
    <Select
      label="Doctor"
      options={options}
      value={selectedDoctorId ?? ""}
      onChange={(val) => onSelect(val)}
      selectSize="sm"
    />
  );
}
