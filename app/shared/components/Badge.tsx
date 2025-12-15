import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-viking-100 text-viking-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-500",
  primary: "bg-viking-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  icon,
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />
      )}
      {icon && <span className="w-3 h-3 flex-shrink-0">{icon}</span>}
      {children}
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
    { label: string; variant: BadgeVariant; dot?: boolean }
  > = {
    admitted: { label: "Admitted", variant: "success", dot: true },
    discharged: { label: "Discharged", variant: "default" },
    observation: { label: "Observ.", variant: "warning", dot: true },
    critical: { label: "Critical", variant: "danger", dot: true },
    pending: { label: "Pending", variant: "default" },
    confirmed: { label: "Confirmed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "danger" },
    completed: { label: "Completed", variant: "primary" },
  };

  const config = statusConfig[status];
  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      size="sm"
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
  const priorityConfig: Record<string, { label: string; variant: BadgeVariant }> = {
    urgent: { label: "URGENT", variant: "danger" },
    high: { label: "HIGH", variant: "warning" },
    normal: { label: "NORMAL", variant: "default" },
    low: { label: "LOW", variant: "info" },
  };

  const config = priorityConfig[priority];
  return (
    <Badge variant={config.variant} size="sm" className={`uppercase ${className}`}>
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
    { label: string; variant: BadgeVariant; icon?: ReactNode }
  > = {
    high: { label: "High Stock", variant: "success" },
    good: { label: "Good Stock", variant: "success" },
    adequate: { label: "Adequate", variant: "primary" },
    low: {
      label: "Low Stock",
      variant: "danger",
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
    <Badge variant={config.variant} size="sm" icon={config.icon} className={className}>
      {config.label}
    </Badge>
  );
}
