// 2025 Design: Clean progress bars & rings
// - Muted, professional colors
// - No flashy gradients
// - Slate-based palette for consistency

type ProgressVariant = "default" | "success" | "warning" | "danger" | "info";
type ProgressSize = "sm" | "md" | "lg";

interface ProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

// Solid, muted bar styles - no gradients
const barStyles: Record<ProgressVariant, string> = {
  default: "bg-slate-600",
  success: "bg-emerald-600",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-slate-500",
};

// Subtle slate-based track backgrounds
const trackStyles: Record<ProgressVariant, string> = {
  default: "bg-slate-200/60",
  success: "bg-slate-200/60",
  warning: "bg-slate-200/60",
  danger: "bg-slate-200/60",
  info: "bg-slate-200/60",
};

const sizeStyles: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-2.5",
};

export function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  label,
  showPercentage = false,
  className = "",
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(showLabel || label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
          {showLabel && !showPercentage && (
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${trackStyles[variant]} ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} rounded-full ${barStyles[variant]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Stock level progress with automatic color coding
interface StockProgressProps {
  current: number;
  max: number;
  reorderLevel?: number;
  size?: ProgressSize;
  showLabel?: boolean;
  className?: string;
}

export function StockProgress({
  current,
  max,
  reorderLevel,
  size = "md",
  showLabel = true,
  className = "",
}: StockProgressProps) {
  const percentage = (current / max) * 100;
  const threshold = reorderLevel ? (reorderLevel / max) * 100 : 20;

  let variant: ProgressVariant = "success";
  if (percentage <= threshold) {
    variant = "danger";
  } else if (percentage <= threshold * 2) {
    variant = "warning";
  }

  return (
    <Progress
      value={current}
      max={max}
      variant={variant}
      size={size}
      showLabel={showLabel}
      className={className}
    />
  );
}

// Circular progress / ring
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
}

// Muted colors for circular progress - slate-based tracks
const ringColors: Record<ProgressVariant, { stroke: string; track: string }> = {
  default: { stroke: "#475569", track: "#e2e8f0" }, // slate-600, slate-200
  success: { stroke: "#059669", track: "#e2e8f0" }, // emerald-600, slate-200
  warning: { stroke: "#d97706", track: "#e2e8f0" }, // amber-600, slate-200
  danger: { stroke: "#dc2626", track: "#e2e8f0" }, // red-600, slate-200
  info: { stroke: "#64748b", track: "#e2e8f0" }, // slate-500, slate-200
};

export function CircularProgress({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  variant = "default",
  showLabel = true,
  className = "",
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const colors = ringColors[variant];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-semibold text-slate-700 tabular-nums">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

// Mini ring for compact displays (no label)
interface MiniRingProps {
  value: number;
  max?: number;
  size?: number;
  variant?: ProgressVariant;
  className?: string;
}

export function MiniRing({
  value,
  max = 100,
  size = 20,
  variant = "default",
  className = "",
}: MiniRingProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const colors = ringColors[variant];

  return (
    <svg width={size} height={size} className={`transform -rotate-90 ${className}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.track}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-400 ease-out"
      />
    </svg>
  );
}
