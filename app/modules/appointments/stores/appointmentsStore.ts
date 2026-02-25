import { create } from "zustand";
import type { AppointmentFilters, AppointmentTab } from "../types";

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function getWeekLaterISO() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

const defaultFilters: AppointmentFilters = {
  status: "all",
  doctor_id: "all",
  specialty_id: "all",
  date_from: getTodayISO(),
  date_to: getWeekLaterISO(),
  search: "",
};

interface AppointmentsState {
  activeTab: AppointmentTab;
  filters: AppointmentFilters;
  selectedDoctorId: string | null;
  selectedDate: string;

  setActiveTab: (tab: AppointmentTab) => void;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  resetFilters: () => void;
  setSelectedDoctorId: (id: string | null) => void;
  setSelectedDate: (date: string) => void;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  activeTab: "list",
  filters: defaultFilters,
  selectedDoctorId: null,
  selectedDate: getTodayISO(),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedDoctorId: (id) => set({ selectedDoctorId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
