import { useMemo } from "react";
import type {
  DayOfWeek,
  DoctorSchedule,
  DoctorBlock,
  AvailableSlotsResult,
  TimeSlot,
} from "../types";
import { mockAppointments } from "./useAppointments";

// Mock schedules per doctor
const mockSchedules: DoctorSchedule[] = [
  // doc-1: Dra. María González (Cardiología) - Lun a Vie mañana + tarde Lun/Mie
  { id: "sch-1", doctor_id: "doc-1", day_of_week: 0, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-2", doctor_id: "doc-1", day_of_week: 0, start_time: "14:00", end_time: "17:00", is_active: true },
  { id: "sch-3", doctor_id: "doc-1", day_of_week: 1, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-4", doctor_id: "doc-1", day_of_week: 2, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-5", doctor_id: "doc-1", day_of_week: 2, start_time: "14:00", end_time: "17:00", is_active: true },
  { id: "sch-6", doctor_id: "doc-1", day_of_week: 3, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-7", doctor_id: "doc-1", day_of_week: 4, start_time: "08:00", end_time: "12:00", is_active: true },

  // doc-2: Dr. Carlos Rodríguez (General) - Lun a Vie mañana
  { id: "sch-8", doctor_id: "doc-2", day_of_week: 0, start_time: "09:00", end_time: "13:00", is_active: true },
  { id: "sch-9", doctor_id: "doc-2", day_of_week: 1, start_time: "09:00", end_time: "13:00", is_active: true },
  { id: "sch-10", doctor_id: "doc-2", day_of_week: 2, start_time: "09:00", end_time: "13:00", is_active: true },
  { id: "sch-11", doctor_id: "doc-2", day_of_week: 3, start_time: "09:00", end_time: "13:00", is_active: true },
  { id: "sch-12", doctor_id: "doc-2", day_of_week: 4, start_time: "09:00", end_time: "13:00", is_active: true },

  // doc-3: Dra. Ana Martínez (Dermatología) - Lun/Mie/Vie
  { id: "sch-13", doctor_id: "doc-3", day_of_week: 0, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-14", doctor_id: "doc-3", day_of_week: 0, start_time: "14:00", end_time: "16:00", is_active: true },
  { id: "sch-15", doctor_id: "doc-3", day_of_week: 2, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-16", doctor_id: "doc-3", day_of_week: 4, start_time: "08:00", end_time: "12:00", is_active: true },

  // doc-4: Dr. Luis Hernández (Psicología) - Lun a Jue tarde
  { id: "sch-17", doctor_id: "doc-4", day_of_week: 0, start_time: "13:00", end_time: "18:00", is_active: true },
  { id: "sch-18", doctor_id: "doc-4", day_of_week: 1, start_time: "13:00", end_time: "18:00", is_active: true },
  { id: "sch-19", doctor_id: "doc-4", day_of_week: 2, start_time: "13:00", end_time: "18:00", is_active: true },
  { id: "sch-20", doctor_id: "doc-4", day_of_week: 3, start_time: "13:00", end_time: "18:00", is_active: true },

  // doc-5: Dra. Patricia López (Oftalmología) - Mar/Jue
  { id: "sch-21", doctor_id: "doc-5", day_of_week: 1, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-22", doctor_id: "doc-5", day_of_week: 1, start_time: "14:00", end_time: "16:00", is_active: true },
  { id: "sch-23", doctor_id: "doc-5", day_of_week: 3, start_time: "08:00", end_time: "12:00", is_active: true },
  { id: "sch-24", doctor_id: "doc-5", day_of_week: 3, start_time: "14:00", end_time: "16:00", is_active: true },

  // doc-6: Dr. Roberto Díaz (General) - Lun a Vie mañana
  { id: "sch-25", doctor_id: "doc-6", day_of_week: 0, start_time: "07:00", end_time: "12:00", is_active: true },
  { id: "sch-26", doctor_id: "doc-6", day_of_week: 1, start_time: "07:00", end_time: "12:00", is_active: true },
  { id: "sch-27", doctor_id: "doc-6", day_of_week: 2, start_time: "07:00", end_time: "12:00", is_active: true },
  { id: "sch-28", doctor_id: "doc-6", day_of_week: 3, start_time: "07:00", end_time: "12:00", is_active: true },
  { id: "sch-29", doctor_id: "doc-6", day_of_week: 4, start_time: "07:00", end_time: "12:00", is_active: true },
];

const mockBlocks: DoctorBlock[] = [
  {
    id: "blk-1",
    doctor_id: "doc-3",
    start_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 10);
      return d.toISOString().split("T")[0];
    })(),
    end_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d.toISOString().split("T")[0];
    })(),
    reason: "Congreso de Dermatología",
  },
  {
    id: "blk-2",
    doctor_id: "doc-1",
    start_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 20);
      return d.toISOString().split("T")[0];
    })(),
    end_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 25);
      return d.toISOString().split("T")[0];
    })(),
    reason: "Vacaciones",
  },
  {
    id: "blk-3",
    doctor_id: "doc-4",
    start_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    })(),
    end_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    })(),
    reason: "Día personal",
  },
];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function getDayOfWeek(dateStr: string): DayOfWeek {
  const d = new Date(dateStr + "T00:00:00");
  // JS: 0=Sunday, we want 0=Monday
  const jsDay = d.getDay();
  return (jsDay === 0 ? 6 : jsDay - 1) as DayOfWeek;
}

export function getSchedulesForDoctor(doctorId: string): DoctorSchedule[] {
  return mockSchedules.filter((s) => s.doctor_id === doctorId && s.is_active);
}

export function getBlocksForDoctor(doctorId: string): DoctorBlock[] {
  return mockBlocks.filter((b) => b.doctor_id === doctorId);
}

export function useAvailableSlots(
  doctorId: string | null,
  date: string | null,
  durationMinutes: number = 30
): AvailableSlotsResult {
  return useMemo(() => {
    if (!doctorId || !date) {
      return { slots: [], blocked: false };
    }

    // Check if day is blocked
    const blocks = getBlocksForDoctor(doctorId);
    const block = blocks.find((b) => date >= b.start_date && date <= b.end_date);
    if (block) {
      return { slots: [], blocked: true, block_reason: block.reason };
    }

    const dayOfWeek = getDayOfWeek(date);
    const schedules = getSchedulesForDoctor(doctorId).filter(
      (s) => s.day_of_week === dayOfWeek
    );

    if (schedules.length === 0) {
      return { slots: [], blocked: false };
    }

    // Get existing appointments for this doctor on this date
    const existingApts = mockAppointments.filter(
      (a) =>
        a.doctor_id === doctorId &&
        a.scheduled_date === date &&
        a.status !== "cancelled" &&
        a.status !== "no_show"
    );

    const allSlots: TimeSlot[] = [];

    for (const schedule of schedules) {
      const schedStart = timeToMinutes(schedule.start_time);
      const schedEnd = timeToMinutes(schedule.end_time);

      for (
        let slotStart = schedStart;
        slotStart + durationMinutes <= schedEnd;
        slotStart += 30
      ) {
        const slotEnd = slotStart + durationMinutes;
        const slotTime = minutesToTime(slotStart);

        // Check overlap with existing appointments
        const overlaps = existingApts.some((apt) => {
          const aptStart = timeToMinutes(apt.scheduled_start_time);
          const aptEnd = timeToMinutes(apt.scheduled_end_time);
          return slotStart < aptEnd && slotEnd > aptStart;
        });

        allSlots.push({
          time: slotTime,
          available: !overlaps,
        });
      }
    }

    return { slots: allSlots, blocked: false };
  }, [doctorId, date, durationMinutes]);
}
