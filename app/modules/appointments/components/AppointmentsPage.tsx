import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/shared/components";
import { useAppointmentsStore } from "../stores";
import { AppointmentsDashboard } from "./AppointmentsDashboard";
import { AppointmentDetailDialog } from "./AppointmentDetailDialog";
import { DoctorAgenda } from "./DoctorAgenda";
import { ScheduleConfig } from "./ScheduleConfig";
import type { Appointment, AppointmentTab } from "../types";

const tabs: { id: AppointmentTab; label: string }[] = [
  { id: "list", label: "Citas" },
  { id: "agenda", label: "Agenda Doctor" },
  { id: "schedule", label: "Horarios" },
];

export function AppointmentsPage() {
  const { activeTab, setActiveTab } = useAppointmentsStore();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900">Citas</h1>
          <p className="text-xs text-slate-500 font-mono">
            Gestión de citas y agendas médicas
          </p>
        </div>
        <Link to="new">
          <Button
            variant="primary"
            size="sm"
            icon={
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            }
          >
            Nueva Cita
          </Button>
        </Link>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-viking-600 text-viking-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "list" && (
        <AppointmentsDashboard
          onSelectAppointment={setSelectedAppointment}
        />
      )}
      {activeTab === "agenda" && <DoctorAgenda />}
      {activeTab === "schedule" && <ScheduleConfig />}

      {/* Detail Dialog */}
      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
