import { useState, useMemo } from "react";
import { Card } from "~/shared/components";
import { DayScheduleRow } from "./DayScheduleRow";
import { getSchedulesForDoctor } from "../hooks/useAvailableSlots";
import type { DoctorSchedule, DayOfWeek } from "../types";

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
}

const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface WeeklyScheduleBuilderProps {
  doctorId: string;
}

export function WeeklyScheduleBuilder({ doctorId }: WeeklyScheduleBuilderProps) {
  const baseSchedules = useMemo(() => getSchedulesForDoctor(doctorId), [doctorId]);

  // Local editable state derived from mock data
  const [activeDays, setActiveDays] = useState<boolean[]>(() => {
    const active = [false, false, false, false, false, false, false];
    baseSchedules.forEach((s) => {
      active[s.day_of_week] = true;
    });
    return active;
  });

  // Group schedules by day
  const schedulesByDay = useMemo(() => {
    const grouped: DoctorSchedule[][] = Array.from({ length: 7 }, () => []);
    baseSchedules.forEach((s) => {
      grouped[s.day_of_week].push(s);
    });
    return grouped;
  }, [baseSchedules]);

  function handleToggleDay(dayIndex: number, active: boolean) {
    setActiveDays((prev) => {
      const next = [...prev];
      next[dayIndex] = active;
      return next;
    });
  }

  function handleUpdateSchedules(_dayIndex: number, _blocks: TimeBlock[]) {
    // Mock: in real app, would update state/API
    // For now, just a no-op since this is UI demo
  }

  return (
    <Card variant="flat" padding="md">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Disponibilidad Semanal</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure los bloques horarios de atención para cada día
        </p>
      </div>

      <div>
        {DAY_LABELS.map((label, i) => (
          <DayScheduleRow
            key={label}
            dayLabel={label}
            dayIndex={i}
            schedules={schedulesByDay[i]}
            isActive={activeDays[i]}
            onToggle={(active) => handleToggleDay(i, active)}
            onUpdateSchedules={handleUpdateSchedules}
          />
        ))}
      </div>
    </Card>
  );
}
