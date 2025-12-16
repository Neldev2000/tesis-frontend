import type { SVGProps } from "react";

// 2025 Design: Micro-visualizations for dashboard metrics
// Inspired by Mercury's sparklines and mini charts

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "default" | "success" | "danger" | "warning";
  strokeWidth?: number;
  filled?: boolean;
  className?: string;
}

const colorMap = {
  default: { stroke: "#6b7280", fill: "#6b7280" },
  success: { stroke: "#10b981", fill: "#10b981" },
  danger: { stroke: "#ef4444", fill: "#ef4444" },
  warning: { stroke: "#f59e0b", fill: "#f59e0b" },
};

export function Sparkline({
  data,
  width = 80,
  height = 32,
  color = "default",
  strokeWidth = 1.5,
  filled = false,
  className = "",
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - min) / range) * chartHeight;
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  const colors = colorMap[color];

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      {filled && (
        <path
          d={areaPath}
          fill={colors.fill}
          fillOpacity={0.1}
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={width - padding}
        cy={padding + chartHeight - ((data[data.length - 1] - min) / range) * chartHeight}
        r={2}
        fill={colors.stroke}
      />
    </svg>
  );
}

// Mini bar chart for categorical data
interface MiniBarChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "default" | "success" | "danger" | "warning";
  gap?: number;
  className?: string;
}

export function MiniBarChart({
  data,
  width = 60,
  height = 24,
  color = "default",
  gap = 2,
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
        const barHeight = (value / max) * height;
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
            rx={1}
            fill={colors.fill}
            fillOpacity={isLast ? 0.8 : 0.3}
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
  color?: "default" | "success" | "danger" | "warning";
  showValue?: boolean;
}

export function ProgressRing({
  value,
  max = 100,
  size = 40,
  strokeWidth = 3,
  color = "default",
  showValue = false,
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
        stroke="#e5e7eb"
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
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
      {showValue && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] font-medium fill-gray-700"
        >
          {Math.round(percentage)}%
        </text>
      )}
    </svg>
  );
}

// Trend indicator with arrow
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
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  };

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${colors[direction]} ${className}`}>
      {direction === "up" && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      )}
      {direction === "down" && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      )}
      {value}
    </span>
  );
}
