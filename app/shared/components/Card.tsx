import type { ReactNode } from "react";

// 2025 Design: Premium card styles - "Surgical Precision" aesthetic
// - NO borders, use surface elevation with ultra-diffuse shadows
// - Larger border-radius (16-20px) for organic, touchable feel
// - Background contrast instead of lines for separation
// - Bento grid ready

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
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
};

// Premium shadow styles - colored tint shadows (not gray!)
// Uses indigo/teal tint for depth - feels like it "glows" not "dirties"
const variantStyles: Record<CardVariant, string> = {
  // Default: White surface with subtle colored shadow (indigo tint)
  default: "bg-white shadow-[0_1px_3px_rgba(99,102,241,0.04),0_4px_16px_rgba(99,102,241,0.06)]",
  // Elevated: More prominent colored shadow for important cards
  elevated: "bg-white shadow-[0_2px_8px_rgba(99,102,241,0.06),0_12px_32px_rgba(99,102,241,0.1)]",
  // Ghost: Subtle background, no shadow
  ghost: "bg-gray-50/60",
  // Flat: Pure white, minimal styling
  flat: "bg-white",
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
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? "hover:shadow-[0_4px_12px_rgba(99,102,241,0.08),0_16px_40px_rgba(99,102,241,0.12)] transition-shadow duration-200 cursor-pointer" : ""}
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
    <h3 className={`text-sm font-medium text-gray-600 ${className}`}>
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
      className={`flex items-center justify-between gap-4 pt-4 mt-4 border-t border-gray-100/80 ${className}`}
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

// Pastel backgrounds with saturated icons - premium look
const iconColorStyles = {
  default: "bg-gray-100/80 text-gray-500",
  red: "bg-red-50/80 text-red-500",
  amber: "bg-amber-50/80 text-amber-500",
  green: "bg-emerald-50/80 text-emerald-500",
  blue: "bg-blue-50/80 text-blue-500",
  violet: "bg-violet-50/80 text-violet-500",
};

const trendStyles = {
  up: "text-emerald-500",
  down: "text-red-500",
  neutral: "text-gray-400",
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
        <div className="flex-1 min-w-0 space-y-4">
          {/* Title - small and secondary */}
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorStyles[iconColor]}`}
              >
                <span className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
              </div>
            )}
            <span className="text-sm font-medium text-gray-500">{title}</span>
          </div>

          {/* Value - THE HERO */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-gray-900 tabular-nums tracking-tight">
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

        {/* Visualization area */}
        {visualization && (
          <div className="flex-shrink-0 w-24 h-12 mt-2">
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
    positive: "text-emerald-500",
    negative: "text-red-500",
    neutral: "text-gray-400",
  };

  return (
    <div className={`${className}`}>
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">{value}</span>
        {change && (
          <span className={`text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
