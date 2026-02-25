import { TimeInput } from "~/shared/components";

interface TimeBlockEditorProps {
  startTime: string;
  endTime: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  onRemove: () => void;
  error?: string;
}

export function TimeBlockEditor({
  startTime,
  endTime,
  onChangeStart,
  onChangeEnd,
  onRemove,
  error,
}: TimeBlockEditorProps) {
  return (
    <div className="flex items-center gap-2">
      <TimeInput
        value={startTime}
        onChange={(e) => onChangeStart(e.target.value)}
        inputSize="sm"
      />
      <span className="text-slate-400 text-xs">–</span>
      <TimeInput
        value={endTime}
        onChange={(e) => onChangeEnd(e.target.value)}
        inputSize="sm"
      />
      <button
        onClick={onRemove}
        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
        title="Eliminar bloque"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  );
}
