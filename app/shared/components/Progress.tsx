// 2025 Design: Premium progress bars & rings
// - Consistent with design system (Tailwind-based)
// - Soft colored tracks
// - Subtle gradients
// - Cohesive with other components

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

// Gradient bar styles - subtle shine effect
const barStyles: Record<ProgressVariant, string> = {
  default: "bg-gradient-to-r from-viking-500 via-viking-400 to-viking-500",
  success: "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500",
  warning: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500",
  danger: "bg-gradient-to-r from-red-500 via-red-400 to-red-500",
  info: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500",
};

// Soft colored track backgrounds
const trackStyles: Record<ProgressVariant, string> = {
  default: "bg-viking-100/40",
  success: "bg-emerald-100/40",
  warning: "bg-amber-100/40",
  danger: "bg-red-100/40",
  info: "bg-blue-100/40",
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
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-medium text-gray-500 tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
          {showLabel && !showPercentage && (
            <span className="text-xs font-medium text-gray-500 tabular-nums">
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

// Colors for circular progress
const ringColors: Record<ProgressVariant, { stroke: string; track: string }> = {
  default: { stroke: "#0d9488", track: "#ccfbf1" },
  success: { stroke: "#10b981", track: "#d1fae5" },
  warning: { stroke: "#f59e0b", track: "#fef3c7" },
  danger: { stroke: "#ef4444", track: "#fee2e2" },
  info: { stroke: "#3b82f6", track: "#dbeafe" },
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
        <span className="absolute text-xs font-semibold text-gray-700 tabular-nums">
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
