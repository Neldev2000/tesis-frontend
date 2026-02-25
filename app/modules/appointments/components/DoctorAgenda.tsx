import { useState, useMemo } from "react";
import { Button } from "~/shared/components";
import { useAppointmentsStore } from "../stores";
import { mockAppointments } from "../hooks";
import { getSchedulesForDoctor, getBlocksForDoctor } from "../hooks/useAvailableSlots";
import { DoctorSelector } from "./DoctorSelector";
import { WeeklyCalendarGrid } from "./WeeklyCalendarGrid";
import { AppointmentDetailDialog } from "./AppointmentDetailDialog";
import type { Appointment } from "../types";

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie"];

function getWeekDays(baseDate: Date): { date: string; dayLabel: string; dayNum: number; isToday: boolean }[] {
  const today = new Date().toISOString().split("T")[0];
  const d = new Date(baseDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);

  return Array.from({ length: 5 }, (_, i) => {
    const current = new Date(d);
    current.setDate(d.getDate() + i);
    const iso = current.toISOString().split("T")[0];
    return {
      date: iso,
      dayLabel: DAY_LABELS[i],
      dayNum: current.getDate(),
      isToday: iso === today,
    };
  });
}

function formatWeekRange(days: { date: string }[]): string {
  if (days.length === 0) return "";
  const start = new Date(days[0].date + "T00:00:00");
  const end = new Date(days[days.length - 1].date + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${start.toLocaleDateString("es-VE", opts)} – ${end.toLocaleDateString("es-VE", opts)}`;
}

export function DoctorAgenda() {
  const { selectedDoctorId, setSelectedDoctorId } = useAppointmentsStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [detailAppointment, setDetailAppointment] = useState<Appointment | null>(null);

  // Auto-select first doctor if none selected
  const doctorId = selectedDoctorId ?? "doc-1";

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDays = useMemo(() => getWeekDays(baseDate), [baseDate]);

  const schedules = useMemo(() => getSchedulesForDoctor(doctorId), [doctorId]);
  const blocks = useMemo(() => getBlocksForDoctor(doctorId), [doctorId]);

  const doctorAppointments = useMemo(
    () => mockAppointments.filter((a) => a.doctor_id === doctorId),
    [doctorId]
  );

  function goToToday() {
    setWeekOffset(0);
  }

  return (
    <div className="space-y-4">
      {/* Doctor Selector */}
      <DoctorSelector
        selectedDoctorId={doctorId}
        onSelect={(id) => setSelectedDoctorId(id)}
      />

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekOffset((w) => w - 1)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
          >
            Hoy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekOffset((w) => w + 1)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            }
          />
        </div>
        <span className="text-sm font-medium text-slate-700">
          {formatWeekRange(weekDays)}
        </span>
      </div>

      {/* Weekly Calendar */}
      <WeeklyCalendarGrid
        weekDays={weekDays}
        schedules={schedules}
        blocks={blocks}
        appointments={doctorAppointments}
        onAppointmentClick={setDetailAppointment}
      />

      {/* Appointment Detail Dialog */}
      <AppointmentDetailDialog
        appointment={detailAppointment}
        open={detailAppointment !== null}
        onClose={() => setDetailAppointment(null)}
        onStatusChange={() => setDetailAppointment(null)}
      />
    </div>
  );
}
