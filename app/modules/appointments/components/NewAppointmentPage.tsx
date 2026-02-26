import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { Combobox, Select, Textarea, Button, Badge } from "~/shared/components";
import { mockPatients } from "../hooks/useAppointments";
import { mockSpecialties } from "../hooks/useSpecialties";
import { mockDoctors } from "../hooks/useDoctors";
import { useAvailableSlots, isDoctorAvailableOnDate } from "../hooks/useAvailableSlots";
import type { Specialty } from "../types";

/* ── Calendar helpers ── */

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAY_HEADERS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

interface CalendarDay {
  date: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const today = new Date().toISOString().split("T")[0];
  const days: CalendarDay[] = [];

  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    const dateStr = `${py}-${String(pm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(py, pm, d).getDay();
    days.push({ date: dateStr, dayNum: d, isCurrentMonth: false, isToday: dateStr === today, isPast: dateStr < today, isWeekend: dow === 0 || dow === 6 });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(year, month, d).getDay();
    days.push({ date: dateStr, dayNum: d, isCurrentMonth: true, isToday: dateStr === today, isPast: dateStr < today, isWeekend: dow === 0 || dow === 6 });
  }

  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      const dateStr = `${ny}-${String(nm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dow = new Date(ny, nm, d).getDay();
      days.push({ date: dateStr, dayNum: d, isCurrentMonth: false, isToday: dateStr === today, isPast: dateStr < today, isWeekend: dow === 0 || dow === 6 });
    }
  }

  return days;
}

function computeEndTime(start: string, mins: number): string {
  const [h, m] = start.split(":").map(Number);
  const t = h * 60 + m + mins;
  return `${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}`;
}

function formatSelectedDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long" });
}

/* ── Component ── */

export function NewAppointmentPage() {
  const navigate = useNavigate();
  const now = new Date();

  // Selection state
  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  const [specialtyId, setSpecialtyId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  // Calendar state
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  // Derived data
  const selectedSpecialty: Specialty | null = useMemo(
    () => mockSpecialties.find((s) => s.id === specialtyId) ?? null,
    [specialtyId]
  );

  const isFirstVisit = true;
  const durationMinutes = selectedSpecialty
    ? isFirstVisit
      ? selectedSpecialty.default_first_visit_duration
      : selectedSpecialty.default_follow_up_duration
    : 30;

  const filteredDoctors = useMemo(
    () => (specialtyId ? mockDoctors.filter((d) => d.specialty_id === specialtyId) : mockDoctors),
    [specialtyId]
  );

  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const { slots, blocked, block_reason } = useAvailableSlots(
    doctorId || null,
    selectedDate,
    durationMinutes
  );

  const availableSlots = slots.filter((s) => s.available);

  // Precompute which calendar days the doctor is unavailable on
  const unavailableDates = useMemo(() => {
    if (!doctorId) return new Set<string>();
    const set = new Set<string>();
    for (const day of calendarDays) {
      if (day.isCurrentMonth && !day.isPast && !day.isWeekend) {
        if (!isDoctorAvailableOnDate(doctorId, day.date)) {
          set.add(day.date);
        }
      }
    }
    return set;
  }, [doctorId, calendarDays]);

  // Options for selectors
  const patientOptions = useMemo(
    () =>
      mockPatients.map((p) => ({
        value: p.id,
        label: `${p.first_name} ${p.first_lastname}`,
        description: `CI: ${p.ci} · NHM: ${p.nhm}`,
      })),
    []
  );

  const specialtyOptions = useMemo(
    () => mockSpecialties.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const doctorOptions = useMemo(
    () =>
      filteredDoctors.map((d) => ({
        value: d.id,
        label: d.full_name,
        description: d.doctor_code,
      })),
    [filteredDoctors]
  );

  // Can create?
  const canCreate = patientId && doctorId && selectedDate && selectedTime;

  // Navigation
  function goToPrevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else { setViewMonth((m) => m - 1); }
  }
  function goToNextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else { setViewMonth((m) => m + 1); }
  }
  function goToToday() {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today.toISOString().split("T")[0]);
    setSelectedTime(null);
  }

  const canGoPrev =
    viewYear > now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth > now.getMonth());
  const maxDateLimit = new Date(now.getFullYear(), now.getMonth() + 3, 1);
  const canGoNext = new Date(viewYear, viewMonth + 1, 1).getTime() < maxDateLimit.getTime();

  function handleCreate() {
    navigate("../appointments");
  }

  return (
    <div className="flex flex-col gap-5 min-h-[calc(100vh-8rem)]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="../appointments"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Citas
          </Link>
          <span className="text-slate-300">/</span>
          <h1 className="text-base font-semibold text-slate-900">Nueva Cita</h1>
        </div>
        {isFirstVisit && (
          <Badge variant="primary" style="ghost" size="sm">
            Primera Vez
          </Badge>
        )}
      </div>

      {/* ── Selectors Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Combobox
          label="Paciente"
          placeholder="Buscar por nombre o CI..."
          options={patientOptions}
          value={patientId}
          onChange={(val) => setPatientId(val)}
          selectSize="lg"
        />
        <Select
          label="Especialidad"
          placeholder="Seleccionar..."
          options={specialtyOptions}
          value={specialtyId}
          onChange={(val) => {
            setSpecialtyId(val);
            setDoctorId("");
            setSelectedDate(null);
            setSelectedTime(null);
          }}
          selectSize="lg"
        />
        <Select
          label="Doctor"
          placeholder={specialtyId ? "Seleccionar doctor..." : "Primero seleccione especialidad"}
          options={doctorOptions}
          value={doctorId}
          onChange={(val) => {
            setDoctorId(val);
            setSelectedDate(null);
            setSelectedTime(null);
          }}
          disabled={!specialtyId}
          selectSize="lg"
        />
      </div>

      {/* ── Main Content: Calendar + Slots ── */}
      {!doctorId ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="text-center">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
            </svg>
            <p className="text-sm text-slate-500">
              Seleccione paciente, especialidad y doctor para ver la disponibilidad
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-5 flex-1 min-h-0">
            {/* ── Left: Calendar (~70%) ── */}
            <div className="flex-[7] min-w-0 flex flex-col">
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex-1 flex flex-col">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-5">
                  <button
                    onClick={goToPrevMonth}
                    disabled={!canGoPrev}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-slate-800">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </span>
                    <button
                      onClick={goToToday}
                      className="text-xs font-medium text-viking-600 hover:text-viking-700 bg-viking-50 hover:bg-viking-100 px-2 py-0.5 rounded transition-colors"
                    >
                      Hoy
                    </button>
                  </div>
                  <button
                    onClick={goToNextMonth}
                    disabled={!canGoNext}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAY_HEADERS.map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
                  {calendarDays.map((day) => {
                    const isSelected = selectedDate === day.date;
                    const noAvailability = unavailableDates.has(day.date);
                    const isDisabled = day.isPast || day.isWeekend || !day.isCurrentMonth || noAvailability;

                    return (
                      <button
                        key={day.date}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedDate(day.date);
                            setSelectedTime(null);
                          }
                        }}
                        disabled={isDisabled}
                        className={`
                          relative min-h-12 w-full text-sm font-medium rounded-lg transition-all
                          ${isSelected
                            ? "bg-viking-600 text-white shadow-sm"
                            : day.isToday && !isDisabled
                              ? "bg-viking-50 text-viking-700 font-bold hover:bg-viking-100"
                              : isDisabled
                                ? "text-slate-200 cursor-not-allowed"
                                : "text-slate-700 hover:bg-slate-100"
                          }
                        `}
                      >
                        {day.dayNum}
                        {day.isToday && !isSelected && (
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-viking-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Duration info */}
                {selectedSpecialty && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="text-xs text-slate-500">
                      Duración: {durationMinutes} min ({selectedSpecialty.name})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Slots Panel (~30%) ── */}
            <div className="flex-[3] min-w-0">
              <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-4">
                {!selectedDate ? (
                  <div className="text-center py-12">
                    <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p className="text-sm text-slate-500">Seleccione una fecha</p>
                    <p className="text-xs text-slate-400 mt-0.5">en el calendario para ver horarios</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <p className="text-[11px] font-semibold text-viking-600 uppercase tracking-wider mb-1">
                        Horarios
                      </p>
                      <p className="text-base font-semibold text-slate-800 capitalize">
                        {formatSelectedDate(selectedDate)}
                      </p>
                    </div>

                    {/* Slots or message */}
                    {blocked ? (
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-red-700">Doctor no disponible</p>
                        <p className="text-xs text-red-500 mt-0.5">{block_reason}</p>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="p-4 bg-slate-50 rounded-lg text-center">
                        <p className="text-sm text-slate-600">Sin horarios disponibles</p>
                        <p className="text-xs text-slate-400 mt-0.5">Seleccione otro día</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                          {availableSlots.length} horario{availableSlots.length !== 1 ? "s" : ""} disponible{availableSlots.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto custom-scrollbar-subtle">
                          {slots.map((slot) => {
                            const isSlotSelected = selectedTime === slot.time;
                            const endTime = computeEndTime(slot.time, durationMinutes);
                            return (
                              <button
                                key={slot.time}
                                onClick={() => slot.available && setSelectedTime(slot.time)}
                                disabled={!slot.available}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium tabular-nums transition-all ${
                                  isSlotSelected
                                    ? "bg-viking-50 border-2 border-viking-500 text-viking-700"
                                    : slot.available
                                      ? "bg-white border border-slate-200 text-slate-700 hover:border-viking-300 hover:bg-viking-50/50"
                                      : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed line-through"
                                }`}
                              >
                                <span>{slot.time} – {endTime}</span>
                                {isSlotSelected && (
                                  <svg className="w-5 h-5 text-viking-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Agendar button */}
                        <div className="pt-2">
                          <Button
                            variant="primary"
                            size="md"
                            className="w-full"
                            disabled={!canCreate}
                            onClick={handleCreate}
                          >
                            Agendar Cita
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Reason — always visible when date selected and slots exist */}
                    {!blocked && slots.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <Textarea
                          label="Motivo de la consulta"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Describa brevemente el motivo..."
                          rows={2}
                          textareaSize="sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Footer: Legend + Transaction ID ── */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-viking-500" />
                Disponible
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                No disponible
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                Pasado
              </span>
            </div>
            <span className="text-xs text-slate-300 font-mono">
              ID: #APP-{now.getFullYear()}-{String(now.getMonth() + 1).padStart(2, "0")}-{String(now.getDate()).padStart(2, "0")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
