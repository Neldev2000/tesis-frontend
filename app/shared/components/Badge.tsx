import type { ReactNode } from "react";

// 2025 Design: Muted, professional badge styles
// - Softer colors with subtle backgrounds
// - Better contrast ratios
// - Multiple style variants (solid, soft, outline)

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
type BadgeStyle = "soft" | "outline" | "solid";
type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: BadgeStyle;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

// Soft style (default) - muted backgrounds
const softStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-600",
  primary: "bg-viking-50 text-viking-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

// Outline style - border with transparent bg
const outlineStyles: Record<BadgeVariant, string> = {
  default: "border border-gray-200 text-gray-600 bg-white",
  primary: "border border-viking-200 text-viking-700 bg-white",
  success: "border border-emerald-200 text-emerald-700 bg-white",
  warning: "border border-amber-200 text-amber-700 bg-white",
  danger: "border border-red-200 text-red-700 bg-white",
  info: "border border-blue-200 text-blue-700 bg-white",
};

// Solid style - for emphasis
const solidStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-500 text-white",
  primary: "bg-viking-600 text-white",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

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
  style = "soft",
  size = "sm",
  icon,
  dot = false,
  className = "",
}: BadgeProps) {
  const styleMap = {
    soft: softStyles,
    outline: outlineStyles,
    solid: solidStyles,
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-md
        ${styleMap[style][variant]}
        ${sizeStyles[size].badge}
        ${className}
      `}
    >
      {dot && (
        <span className={`rounded-full flex-shrink-0 ${sizeStyles[size].dot} ${dotStyles[variant]}`} />
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
    { label: string; variant: BadgeVariant; dot?: boolean; style?: BadgeStyle }
  > = {
    admitted: { label: "Admitted", variant: "success", dot: true },
    discharged: { label: "Discharged", variant: "default" },
    observation: { label: "Observation", variant: "warning", dot: true },
    critical: { label: "Critical", variant: "danger", dot: true },
    pending: { label: "Pending", variant: "default", style: "outline" },
    confirmed: { label: "Confirmed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "danger", style: "outline" },
    completed: { label: "Completed", variant: "primary" },
  };

  const config = statusConfig[status];
  return (
    <Badge
      variant={config.variant}
      style={config.style || "soft"}
      dot={config.dot}
      size="xs"
      className={className}
    >
      {config.label}
    </Badge>
  );
}

// Priority badge
export function PriorityBadge({
  priority,
  className = "",
}: {
  priority: "urgent" | "high" | "normal" | "low";
  className?: string;
}) {
  const priorityConfig: Record<string, { label: string; variant: BadgeVariant; style: BadgeStyle }> = {
    urgent: { label: "Urgent", variant: "danger", style: "solid" },
    high: { label: "High", variant: "warning", style: "soft" },
    normal: { label: "Normal", variant: "default", style: "soft" },
    low: { label: "Low", variant: "info", style: "outline" },
  };

  const config = priorityConfig[priority];
  return (
    <Badge variant={config.variant} style={config.style} size="xs" className={className}>
      {config.label}
    </Badge>
  );
}

// Stock level badge
export function StockBadge({
  level,
  className = "",
}: {
  level: "high" | "good" | "adequate" | "low" | "critical";
  className?: string;
}) {
  const levelConfig: Record<
    string,
    { label: string; variant: BadgeVariant; style: BadgeStyle; icon?: ReactNode }
  > = {
    high: { label: "In Stock", variant: "success", style: "soft" },
    good: { label: "Good", variant: "success", style: "soft" },
    adequate: { label: "Adequate", variant: "default", style: "outline" },
    low: {
      label: "Low Stock",
      variant: "warning",
      style: "soft",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      ),
    },
    critical: {
      label: "Critical",
      variant: "danger",
      style: "solid",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      ),
    },
  };

  const config = levelConfig[level];
  return (
    <Badge
      variant={config.variant}
      style={config.style}
      size="xs"
      icon={config.icon}
      className={className}
    >
      {config.label}
    </Badge>
  );
}
