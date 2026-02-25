import { useAppointmentsStore } from "../stores";
import { DoctorSelector } from "./DoctorSelector";
import { WeeklyScheduleBuilder } from "./WeeklyScheduleBuilder";
import { BlockedDatesManager } from "./BlockedDatesManager";

export function ScheduleConfig() {
  const { selectedDoctorId, setSelectedDoctorId } = useAppointmentsStore();
  const doctorId = selectedDoctorId ?? "doc-1";

  return (
    <div className="space-y-4">
      <DoctorSelector
        selectedDoctorId={doctorId}
        onSelect={(id) => setSelectedDoctorId(id)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WeeklyScheduleBuilder doctorId={doctorId} />
        </div>
        <div>
          <BlockedDatesManager doctorId={doctorId} />
        </div>
      </div>
    </div>
  );
}
