import type { ReactNode } from "react";

// 2025 Design: Clean, professional badge styles
// - Ghost/outline as default for non-critical states
// - Dot indicators for status communication
// - Solid ONLY for critical alerts
// - Minimal, non-distracting visual noise

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
type BadgeStyle = "ghost" | "outline" | "soft" | "solid";
type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: BadgeStyle;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  /** Pulsing dot animation for active/critical states */
  pulse?: boolean;
  className?: string;
}

// Ghost style (default) - minimal, just text with slight background
const ghostStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-50 text-gray-600",
  primary: "bg-viking-50/50 text-viking-600",
  success: "bg-emerald-50/50 text-emerald-600",
  warning: "bg-amber-50/50 text-amber-600",
  danger: "bg-red-50/50 text-red-600",
  info: "bg-blue-50/50 text-blue-600",
};

// Outline style - clean border, white background
const outlineStyles: Record<BadgeVariant, string> = {
  default: "border border-gray-200 text-gray-600 bg-white",
  primary: "border border-viking-200/60 text-viking-600 bg-white",
  success: "border border-emerald-200/60 text-emerald-600 bg-white",
  warning: "border border-amber-200/60 text-amber-600 bg-white",
  danger: "border border-red-200/60 text-red-600 bg-white",
  info: "border border-blue-200/60 text-blue-600 bg-white",
};

// Soft style - subtle background (use sparingly)
const softStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100/80 text-gray-700",
  primary: "bg-viking-100/60 text-viking-700",
  success: "bg-emerald-100/60 text-emerald-700",
  warning: "bg-amber-100/60 text-amber-700",
  danger: "bg-red-100/60 text-red-700",
  info: "bg-blue-100/60 text-blue-700",
};

// Solid style - ONLY for critical alerts
const solidStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-600 text-white",
  primary: "bg-viking-600 text-white",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

// Dot colors - slightly muted for elegance
const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-400",
  primary: "bg-viking-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

const sizeStyles: Record<BadgeSize, { badge: string; dot: string; icon: string }> = {
  xs: { badge: "px-1.5 py-0.5 text-[10px] gap-1", dot: "w-1 h-1", icon: "w-2.5 h-2.5" },
  sm: { badge: "px-2 py-0.5 text-xs gap-1", dot: "w-1.5 h-1.5", icon: "w-3 h-3" },
  md: { badge: "px-2.5 py-1 text-xs gap-1.5", dot: "w-1.5 h-1.5", icon: "w-3.5 h-3.5" },
};

export function Badge({
  children,
  variant = "default",
  style = "ghost",
  size = "sm",
  icon,
  dot = false,
  pulse = false,
  className = "",
}: BadgeProps) {
  const styleMap = {
    ghost: ghostStyles,
    outline: outlineStyles,
    soft: softStyles,
    solid: solidStyles,
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-lg
        ${styleMap[style][variant]}
        ${sizeStyles[size].badge}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex-shrink-0">
          {pulse && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotStyles[variant]}`}
            />
          )}
          <span className={`relative rounded-full ${sizeStyles[size].dot} ${dotStyles[variant]}`} />
        </span>
      )}
      {icon && <span className={`flex-shrink-0 ${sizeStyles[size].icon}`}>{icon}</span>}
      {children}
    </span>
  );
}

// Count badge for navigation items (like in Intercom)
export function CountBadge({
  count,
  max = 99,
  variant = "default",
  className = "",
}: {
  count: number;
  max?: number;
  variant?: "default" | "primary" | "danger";
  className?: string;
}) {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    primary: "bg-viking-600 text-white",
    danger: "bg-red-600 text-white",
  };

  if (count === 0) return null;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[18px] h-[18px] px-1.5
        text-[10px] font-semibold rounded-full
        tabular-nums
        ${variants[variant]}
        ${className}
      `}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}

// Preset status badges for common use cases
// Uses ghost/outline with dots for non-critical, solid only for critical
export function StatusBadge({
  status,
  className = "",
}: {
  status:
    | "admitted"
    | "discharged"
    | "observation"
    | "critical"
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed";
  className?: string;
}) {
  const statusConfig: Record<
    string,
    { label: string; variant: BadgeVariant; dot?: boolean; pulse?: boolean; style?: BadgeStyle }
  > = {
    // Active states - use dots to show "live" status
    admitted: { label: "Admitted", variant: "success", dot: true, style: "ghost" },
    observation: { label: "Observation", variant: "warning", dot: true, style: "ghost" },
    critical: { label: "Critical", variant: "danger", dot: true, pulse: true, style: "solid" },
    // Completed/inactive states - clean outline
    discharged: { label: "Discharged", variant: "default", style: "outline" },
    completed: { label: "Completed", variant: "success", style: "outline" },
    // Pending/neutral states - minimal ghost
    pending: { label: "Pending", variant: "default", dot: true, style: "ghost" },
    confirmed: { label: "Confirmed", variant: "success", dot: true, style: "ghost" },
    cancelled: { label: "Cancelled", variant: "default", style: "outline" },
  };

  const config = statusConfig[status];
  return (
    <Badge
      variant={config.variant}
      style={config.style || "ghost"}
      dot={config.dot}
      pulse={config.pulse}
      size="xs"
      className={className}
    >
      {config.label}
    </Badge>
  );
}

// Priority badge - only urgent uses solid
export function PriorityBadge({
  priority,
  className = "",
}: {
  priority: "urgent" | "high" | "normal" | "low";
  className?: string;
}) {
  const priorityConfig: Record<string, { label: string; variant: BadgeVariant; style: BadgeStyle; dot?: boolean; pulse?: boolean }> = {
    urgent: { label: "Urgent", variant: "danger", style: "solid", dot: true, pulse: true },
    high: { label: "High", variant: "warning", style: "ghost", dot: true },
    normal: { label: "Normal", variant: "default", style: "ghost" },
    low: { label: "Low", variant: "default", style: "outline" },
  };

  const config = priorityConfig[priority];
  return (
    <Badge
      variant={config.variant}
      style={config.style}
      dot={config.dot}
      pulse={config.pulse}
      size="xs"
      className={className}
    >
      {config.label}
    </Badge>
  );
}

// Stock level badge - clean dots instead of icons, solid only for critical
export function StockBadge({
  level,
  className = "",
}: {
  level: "high" | "good" | "adequate" | "low" | "critical";
  className?: string;
}) {
  const levelConfig: Record<
    string,
    { label: string; variant: BadgeVariant; style: BadgeStyle; dot?: boolean; pulse?: boolean }
  > = {
    high: { label: "In Stock", variant: "success", style: "ghost", dot: true },
    good: { label: "Good", variant: "success", style: "ghost", dot: true },
    adequate: { label: "Adequate", variant: "default", style: "outline" },
    low: { label: "Low Stock", variant: "warning", style: "ghost", dot: true },
    critical: { label: "Critical", variant: "danger", style: "solid", dot: true, pulse: true },
  };

  const config = levelConfig[level];
  return (
    <Badge
      variant={config.variant}
      style={config.style}
      dot={config.dot}
      pulse={config.pulse}
      size="xs"
      className={className}
    >
      {config.label}
    </Badge>
  );
}
