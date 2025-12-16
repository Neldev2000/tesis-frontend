import type { ReactNode } from "react";

// 2025 Design: STRUCTURED card styles - Linear/Vercel aesthetic
// - Subtle borders for structure (not floating/bubbly)
// - Moderate border-radius (12px) - technical, not "soft"
// - Colored shadows but with visible structure
// - Dense, professional feel

type CardVariant = "default" | "elevated" | "ghost" | "flat";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  variant?: CardVariant;
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
  xl: "p-6",
};

// Clean card styles - minimal, purposeful
const variantStyles: Record<CardVariant, string> = {
  // Default: Clean white surface with subtle border
  default: `
    bg-white
    border border-slate-200/60
  `,
  // Elevated: Slight shadow for layering
  elevated: `
    bg-white
    border border-slate-200/50
    shadow-sm
  `,
  // Ghost: Muted background for secondary content
  ghost: `
    bg-slate-50/80
    border border-slate-200/40
  `,
  // Flat: No border, just surface
  flat: `
    bg-white
  `,
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
        rounded-xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? "hover:border-slate-300 transition-colors duration-150 cursor-pointer" : ""}
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
    <h3 className={`text-sm font-medium text-slate-700 ${className}`}>
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
    <p className={`text-sm text-slate-500 mt-0.5 ${className}`}>{children}</p>
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
      className={`flex items-center justify-between gap-4 pt-3 mt-3 border-t border-slate-100/60 ${className}`}
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

// StatCard - Premium metric card with hero numbers
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
  iconColor?: "default" | "red" | "amber" | "green" | "blue" | "violet";
  className?: string;
  onClick?: () => void;
  /** Optional sparkline or micro-visualization */
  visualization?: ReactNode;
}

// Muted pastel backgrounds with saturated icons
const iconColorStyles = {
  default: "bg-slate-100/70 text-slate-500",
  red: "bg-red-50/70 text-red-600",
  amber: "bg-amber-50/70 text-amber-600",
  green: "bg-emerald-50/70 text-emerald-600",
  blue: "bg-blue-50/70 text-blue-600",
  violet: "bg-violet-50/70 text-violet-600",
};

const trendStyles = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-slate-400",
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
      padding="lg"
      hover={!!onClick}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title - small and secondary */}
          <div className="flex items-center gap-2.5">
            {icon && (
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColorStyles[iconColor]}`}
              >
                <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
              </div>
            )}
            <span className="text-[13px] font-medium text-slate-500">{title}</span>
          </div>

          {/* Value - THE HERO */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tabular-nums tracking-tight font-mono">
              {value}
            </span>
            {trend && (
              <span className={`text-xs font-medium ${trendStyles[trend.direction]}`}>
                {trend.direction === "up" && "↑"}
                {trend.direction === "down" && "↓"}
                {trend.value}
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <span className="block text-xs text-slate-400">{subtitle}</span>
          )}
        </div>

        {/* Visualization area */}
        {visualization && (
          <div className="flex-shrink-0 w-20 h-10 mt-1">
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
    neutral: "text-slate-400",
  };

  return (
    <div className={`${className}`}>
      <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-semibold text-slate-900 tabular-nums font-mono">{value}</span>
        {change && (
          <span className={`text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
