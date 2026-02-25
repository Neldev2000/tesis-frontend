const HOUR_HEIGHT = 60; // px per hour
const START_HOUR = 7;
const END_HOUR = 18;

export function CalendarTimeGutter() {
  const hours: string[] = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hours.push(`${h.toString().padStart(2, "0")}:00`);
  }

  return (
    <div className="relative flex-shrink-0 w-14" style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>
      {hours.map((label, i) => (
        <div
          key={label}
          className="absolute right-2 text-[10px] font-mono text-slate-400 leading-none -translate-y-1/2"
          style={{ top: i * HOUR_HEIGHT }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export { HOUR_HEIGHT, START_HOUR, END_HOUR };
