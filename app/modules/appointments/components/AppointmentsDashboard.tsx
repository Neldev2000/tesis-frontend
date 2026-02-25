import { useState, useMemo } from "react";
import { Card, Sparkline } from "~/shared/components";
import { useAppointmentsStore } from "../stores";
import { useAppointments, mockAppointments } from "../hooks";
import { AppointmentFilters } from "./AppointmentFilters";
import { AppointmentsTable } from "./AppointmentsTable";
import type { Appointment } from "../types";

// Mock sparkline data (7-day trends)
const todayTrend = [4, 6, 3, 5, 7, 4, 6];
const pendingTrend = [2, 3, 5, 4, 3, 2, 4];
const completedTrend = [3, 5, 4, 6, 5, 7, 2];

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export function AppointmentsDashboard({
  onSelectAppointment,
}: {
  onSelectAppointment: (apt: Appointment) => void;
}) {
  const { filters } = useAppointmentsStore();
  const { data: appointments, isLoading } = useAppointments(filters);

  const today = getTodayISO();

  const stats = useMemo(() => {
    const todayApts = mockAppointments.filter(
      (a) => a.scheduled_date === today
    );
    const pendingConfirmation = mockAppointments.filter(
      (a) => a.status === "requested"
    );

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartISO = weekStart.toISOString().split("T")[0];
    const completedThisWeek = mockAppointments.filter(
      (a) => a.status === "completed" && a.scheduled_date >= weekStartISO
    );

    return {
      todayCount: todayApts.length,
      pendingCount: pendingConfirmation.length,
      completedWeek: completedThisWeek.length,
    };
  }, [today]);

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-slate-500 mb-1">Citas Hoy</p>
              <span className="text-[32px] font-semibold text-slate-900 tabular-nums tracking-tight">
                {stats.todayCount}
              </span>
              <p className="text-[12px] text-slate-400 mt-1">
                programadas para hoy
              </p>
            </div>
            <Sparkline data={todayTrend} color="blue" variant="bars" height={32} width={64} />
          </div>
        </Card>

        <Card variant="default" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] text-slate-500">Pendientes</p>
                {stats.pendingCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>
              <span className="text-[32px] font-semibold text-slate-900 tabular-nums tracking-tight">
                {stats.pendingCount}
              </span>
              <p className="text-[12px] text-slate-400 mt-1">
                requieren aprobación
              </p>
            </div>
            <Sparkline data={pendingTrend} color="warning" variant="bars" height={32} width={64} />
          </div>
        </Card>

        <Card variant="default" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-slate-500 mb-1">Completadas</p>
              <span className="text-[32px] font-semibold text-slate-900 tabular-nums tracking-tight">
                {stats.completedWeek}
              </span>
              <p className="text-[12px] text-slate-400 mt-1">
                esta semana
              </p>
            </div>
            <Sparkline data={completedTrend} color="success" variant="bars" height={32} width={64} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <AppointmentFilters />
      </Card>

      {/* Table */}
      <Card padding="none">
        <AppointmentsTable
          appointments={appointments}
          isLoading={isLoading}
          onSelect={onSelectAppointment}
        />
      </Card>
    </div>
  );
}
