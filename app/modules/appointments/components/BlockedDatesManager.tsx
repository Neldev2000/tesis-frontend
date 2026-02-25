import { useState, useMemo } from "react";
import { Card, Button, Input, DateInput } from "~/shared/components";
import { getBlocksForDoctor } from "../hooks/useAvailableSlots";
import type { DoctorBlock } from "../types";

interface BlockedDatesManagerProps {
  doctorId: string;
}

export function BlockedDatesManager({ doctorId }: BlockedDatesManagerProps) {
  const baseBlocks = useMemo(() => getBlocksForDoctor(doctorId), [doctorId]);
  const [blocks, setBlocks] = useState<DoctorBlock[]>(baseBlocks);
  const [showForm, setShowForm] = useState(false);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newReason, setNewReason] = useState("");

  function handleAdd() {
    if (!newStartDate || !newEndDate || !newReason) return;
    const newBlock: DoctorBlock = {
      id: `blk-new-${Date.now()}`,
      doctor_id: doctorId,
      start_date: newStartDate,
      end_date: newEndDate,
      reason: newReason,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setNewStartDate("");
    setNewEndDate("");
    setNewReason("");
    setShowForm(false);
  }

  function handleRemove(blockId: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }

  function formatDateRange(start: string, end: string): string {
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    const s = new Date(start + "T00:00:00").toLocaleDateString("es-VE", opts);
    const e = new Date(end + "T00:00:00").toLocaleDateString("es-VE", opts);
    return start === end ? s : `${s} – ${e}`;
  }

  return (
    <Card variant="flat" padding="md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Fechas Bloqueadas</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Vacaciones, congresos, días personales
          </p>
        </div>
        {!showForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(true)}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
          >
            Agregar
          </Button>
        )}
      </div>

      {/* Existing Blocks */}
      <div className="space-y-2">
        {blocks.length === 0 && !showForm && (
          <p className="text-xs text-slate-400 text-center py-4">
            No hay fechas bloqueadas
          </p>
        )}
        {blocks.map((block) => (
          <div
            key={block.id}
            className="flex items-center gap-3 px-3 py-2 bg-red-50 rounded-lg border border-red-100"
          >
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-red-800">
                {formatDateRange(block.start_date, block.end_date)}
              </p>
              <p className="text-[10px] text-red-600">{block.reason}</p>
            </div>
            <button
              onClick={() => handleRemove(block.id)}
              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors flex-shrink-0"
              title="Eliminar"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add New Block Form */}
      {showForm && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-2">
          <div className="flex gap-2">
            <DateInput
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
              inputSize="sm"
              label="Desde"
            />
            <DateInput
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              inputSize="sm"
              label="Hasta"
            />
          </div>
          <Input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Motivo del bloqueo..."
            inputSize="sm"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={!newStartDate || !newEndDate || !newReason}
            >
              Guardar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
