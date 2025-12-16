type ProgressVariant = "default" | "success" | "warning" | "danger" | "info";
type ProgressSize = "sm" | "md" | "lg";

interface ProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const variantStyles: Record<ProgressVariant, string> = {
  default: "bg-viking-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

const sizeStyles: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  label,
  className = "",
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs text-gray-500">{label}</span>}
          {showLabel && (
            <span className="text-xs font-medium text-gray-700">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} rounded-full transition-all duration-300 ${variantStyles[variant]}`}
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

  const strokeColors: Record<ProgressVariant, string> = {
    default: "stroke-viking-500",
    success: "stroke-green-500",
    warning: "stroke-amber-500",
    danger: "stroke-red-500",
    info: "stroke-blue-500",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-gray-200"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={strokeColors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-semibold text-gray-900">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
