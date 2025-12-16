import type { SVGProps } from "react";

// 2025 Design: TECHNICAL micro-visualizations
// - NOT smooth Bezier curves (that looks AI-generated)
// - Thin vertical bars or connected dots for real data feel
// - Data points visible - shows "real numbers behind"
// - Bloomberg/Linear aesthetic - dense, technical, credible

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "default" | "success" | "danger" | "warning" | "blue";
  /** "line" for connected dots, "bars" for thin vertical bars */
  variant?: "line" | "bars";
  className?: string;
}

// More sophisticated, desaturated palette
const colorMap = {
  default: { stroke: "#64748b", fill: "#64748b", dot: "#475569" },
  success: { stroke: "#059669", fill: "#059669", dot: "#047857" },
  danger: { stroke: "#dc2626", fill: "#dc2626", dot: "#b91c1c" },
  warning: { stroke: "#d97706", fill: "#d97706", dot: "#b45309" },
  blue: { stroke: "#2563eb", fill: "#2563eb", dot: "#1d4ed8" },
};

export function Sparkline({
  data,
  width = 96,
  height = 40,
  color = "default",
  variant = "line",
  className = "",
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = { x: 4, y: 6 };
  const chartWidth = width - padding.x * 2;
  const chartHeight = height - padding.y * 2;

  const colors = colorMap[color];

  // Generate points
  const points = data.map((value, index) => ({
    x: padding.x + (index / (data.length - 1)) * chartWidth,
    y: padding.y + chartHeight - ((value - min) / range) * chartHeight,
    value,
  }));

  if (variant === "bars") {
    // Thin vertical bars - Bloomberg-style
    const barWidth = Math.max(2, chartWidth / data.length - 2);
    const gap = (chartWidth - barWidth * data.length) / (data.length - 1);

    return (
      <svg
        width={width}
        height={height}
        className={className}
        viewBox={`0 0 ${width} ${height}`}
      >
        {data.map((value, index) => {
          const barHeight = Math.max(2, ((value - min) / range) * chartHeight);
          const x = padding.x + index * (barWidth + gap);
          const y = height - padding.y - barHeight;
          const isLast = index === data.length - 1;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={1}
              fill={colors.fill}
              fillOpacity={isLast ? 1 : 0.35}
            />
          );
        })}
      </svg>
    );
  }

  // Line variant with visible data points - technical feel
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Baseline reference - subtle */}
      <line
        x1={padding.x}
        y1={height - padding.y}
        x2={width - padding.x}
        y2={height - padding.y}
        stroke={colors.stroke}
        strokeOpacity={0.1}
        strokeWidth={1}
      />

      {/* Data line - straight segments, not curved */}
      <path
        d={linePath}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points - small dots at each value */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={index === points.length - 1 ? 3 : 1.5}
          fill={index === points.length - 1 ? colors.dot : colors.stroke}
          fillOpacity={index === points.length - 1 ? 1 : 0.6}
        />
      ))}

      {/* End value highlight ring */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={5}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={1}
        strokeOpacity={0.2}
      />
    </svg>
  );
}

// Mini bar chart for categorical data
interface MiniBarChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "default" | "success" | "danger" | "warning" | "blue";
  gap?: number;
  className?: string;
}

export function MiniBarChart({
  data,
  width = 64,
  height = 28,
  color = "default",
  gap = 3,
  className = "",
}: MiniBarChartProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const barWidth = (width - gap * (data.length - 1)) / data.length;
  const colors = colorMap[color];

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      {data.map((value, index) => {
        const barHeight = Math.max((value / max) * height, 2);
        const x = index * (barWidth + gap);
        const y = height - barHeight;
        const isLast = index === data.length - 1;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={colors.fill}
            fillOpacity={isLast ? 0.9 : 0.25}
          />
        );
      })}
    </svg>
  );
}

// Progress ring for percentage values
interface ProgressRingProps extends SVGProps<SVGSVGElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "default" | "success" | "danger" | "warning" | "blue";
  showValue?: boolean;
  bgOpacity?: number;
}

export function ProgressRing({
  value,
  max = 100,
  size = 44,
  strokeWidth = 4,
  color = "default",
  showValue = false,
  bgOpacity = 0.1,
  className = "",
  ...props
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;
  const colors = colorMap[color];

  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      {...props}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.stroke}
        strokeOpacity={bgOpacity}
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
      />
      {showValue && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[11px] font-semibold fill-gray-700"
        >
          {Math.round(percentage)}%
        </text>
      )}
    </svg>
  );
}

// Trend indicator with arrow - more subtle
interface TrendIndicatorProps {
  value: string | number;
  direction: "up" | "down" | "neutral";
  className?: string;
}

export function TrendIndicator({
  value,
  direction,
  className = "",
}: TrendIndicatorProps) {
  const colors = {
    up: "text-emerald-500",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${colors[direction]} ${className}`}>
      {direction === "up" && (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      )}
      {direction === "down" && (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      )}
      {value}
    </span>
  );
}

// Stock level indicator - visual, premium design with gradients
interface StockIndicatorProps {
  current: number;
  max: number;
  reorderLevel?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Premium gradient colors for stock indicator
const stockGradients = {
  success: { start: "#10b981", end: "#34d399" },
  warning: { start: "#f59e0b", end: "#fbbf24" },
  danger: { start: "#ef4444", end: "#f87171" },
};

export function StockIndicator({
  current,
  max,
  reorderLevel,
  size = "sm",
  className = "",
}: StockIndicatorProps) {
  const percentage = (current / max) * 100;
  const threshold = reorderLevel ? (reorderLevel / max) * 100 : 25;

  let colorKey: "success" | "warning" | "danger" = "success";
  if (percentage <= threshold) {
    colorKey = "danger";
  } else if (percentage <= threshold * 2) {
    colorKey = "warning";
  }

  const sizeStyles = {
    sm: { width: 48, height: 6 },
    md: { width: 72, height: 8 },
    lg: { width: 100, height: 10 },
  };

  const { width, height } = sizeStyles[size];
  const gradientId = `stock-gradient-${colorKey}-${Math.random().toString(36).substr(2, 9)}`;
  const colors = stockGradients[colorKey];

  // Track color based on status
  const trackColor = colorKey === "danger" ? "#fee2e2" : colorKey === "warning" ? "#fef3c7" : "#d1fae5";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        {/* Background track - colored based on status */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={height / 2}
          fill={trackColor}
        />
        {/* Progress fill with gradient */}
        <rect
          x={0}
          y={0}
          width={Math.max((percentage / 100) * width, height)}
          height={height}
          rx={height / 2}
          fill={`url(#${gradientId})`}
          style={{ transition: "width 0.4s ease-out" }}
        />
      </svg>
      {/* Pulsing dot for critical status */}
      {percentage <= threshold && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
    </div>
  );
}
