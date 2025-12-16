import type { ReactNode } from "react";

// 2025 Design: Ultra-clean card styles inspired by Mercury
// - Flat by default, optional subtle elevation
// - Refined borders and minimal shadows
// - Better spacing system

type CardVariant = "default" | "outlined" | "elevated" | "ghost";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: CardVariant;
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white border border-gray-200/60",
  outlined: "bg-white border border-gray-200",
  elevated: "bg-white border border-gray-100 shadow-sm shadow-gray-200/50",
  ghost: "bg-gray-50/50",
};

function CardRoot({
  children,
  className = "",
  padding = "md",
  variant = "default",
  hover = false,
  onClick,
}: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`
        rounded-lg
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? "hover:border-gray-300 hover:bg-gray-50/50 transition-colors cursor-pointer" : ""}
        ${onClick ? "text-left w-full" : ""}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

function CardHeader({ children, action, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-sm font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-500 mt-0.5 ${className}`}>{children}</p>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 pt-3 mt-3 border-t border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

// Export as compound component
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

// StatCard - Modern metric card with micro-visualization support
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
  iconColor?: "default" | "red" | "amber" | "green" | "blue" | "gray";
  className?: string;
  onClick?: () => void;
  /** Optional sparkline or micro-visualization */
  visualization?: ReactNode;
}

const iconColorStyles = {
  default: "bg-gray-100 text-gray-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  gray: "bg-gray-100 text-gray-500",
};

const trendStyles = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-gray-500",
};

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconColor = "default",
  className = "",
  onClick,
  visualization,
}: StatCardProps) {
  return (
    <Card
      className={className}
      variant="default"
      hover={!!onClick}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header with icon and title */}
          <div className="flex items-center gap-2.5">
            {icon && (
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center ${iconColorStyles[iconColor]}`}
              >
                <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
              </div>
            )}
            <span className="text-sm text-gray-500">{title}</span>
          </div>

          {/* Value and trend */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 tabular-nums tracking-tight">
              {value}
            </span>
            {trend && (
              <span className={`text-sm font-medium ${trendStyles[trend.direction]}`}>
                {trend.direction === "up" && "↑"}
                {trend.direction === "down" && "↓"}
                {trend.value}
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <span className="block text-xs text-gray-400">{subtitle}</span>
          )}
        </div>

        {/* Visualization area (sparkline, chart, etc) */}
        {visualization && (
          <div className="flex-shrink-0 w-20 h-10">
            {visualization}
          </div>
        )}
      </div>
    </Card>
  );
}

// MetricCard - Compact inline metric for dense layouts
interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  className = "",
}: MetricCardProps) {
  const changeColors = {
    positive: "text-emerald-600",
    negative: "text-red-600",
    neutral: "text-gray-500",
  };

  return (
    <div className={`${className}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-gray-900 tabular-nums">{value}</span>
        {change && (
          <span className={`text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
