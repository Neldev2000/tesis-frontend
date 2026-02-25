import { useState } from "react";
import { Switch, Button } from "~/shared/components";
import { TimeBlockEditor } from "./TimeBlockEditor";
import type { DoctorSchedule } from "../types";

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayScheduleRowProps {
  dayLabel: string;
  dayIndex: number;
  schedules: DoctorSchedule[];
  isActive: boolean;
  onToggle: (active: boolean) => void;
  onUpdateSchedules: (dayIndex: number, blocks: TimeBlock[]) => void;
}

export function DayScheduleRow({
  dayLabel,
  dayIndex,
  schedules,
  isActive,
  onToggle,
  onUpdateSchedules,
}: DayScheduleRowProps) {
  const blocks: TimeBlock[] = schedules.map((s) => ({
    id: s.id,
    startTime: s.start_time,
    endTime: s.end_time,
  }));

  function handleAddBlock() {
    const lastEnd = blocks.length > 0 ? blocks[blocks.length - 1].endTime : "08:00";
    const [h, m] = lastEnd.split(":").map(Number);
    const newStart = lastEnd;
    const newEndMinutes = h * 60 + m + 120; // +2h
    const nh = Math.min(Math.floor(newEndMinutes / 60), 18);
    const nm = newEndMinutes % 60;
    const newEnd = `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;

    onUpdateSchedules(dayIndex, [
      ...blocks,
      { id: `new-${Date.now()}`, startTime: newStart, endTime: newEnd },
    ]);
  }

  function handleRemoveBlock(index: number) {
    const updated = blocks.filter((_, i) => i !== index);
    onUpdateSchedules(dayIndex, updated);
  }

  function handleChangeStart(index: number, value: string) {
    const updated = blocks.map((b, i) => (i === index ? { ...b, startTime: value } : b));
    onUpdateSchedules(dayIndex, updated);
  }

  function handleChangeEnd(index: number, value: string) {
    const updated = blocks.map((b, i) => (i === index ? { ...b, endTime: value } : b));
    onUpdateSchedules(dayIndex, updated);
  }

  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-100 last:border-0">
      {/* Day Label + Toggle */}
      <div className="w-20 flex-shrink-0 pt-1">
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onChange={(e) => onToggle(e.target.checked)}
            switchSize="sm"
          />
          <span
            className={`text-xs font-medium ${isActive ? "text-slate-800" : "text-slate-400"}`}
          >
            {dayLabel}
          </span>
        </div>
      </div>

      {/* Time Blocks */}
      <div className="flex-1">
        {isActive ? (
          <div className="space-y-2">
            {blocks.map((block, i) => (
              <TimeBlockEditor
                key={block.id}
                startTime={block.startTime}
                endTime={block.endTime}
                onChangeStart={(v) => handleChangeStart(i, v)}
                onChangeEnd={(v) => handleChangeEnd(i, v)}
                onRemove={() => handleRemoveBlock(i)}
                error={
                  block.startTime >= block.endTime
                    ? "Hora fin debe ser mayor"
                    : undefined
                }
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddBlock}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              }
            >
              Agregar bloque
            </Button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 pt-1">No disponible</p>
        )}
      </div>
    </div>
  );
}
