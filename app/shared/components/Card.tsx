import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

function CardRoot({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-100 shadow-sm
        ${paddingStyles[padding]}
        ${hover ? "hover:border-gray-200 hover:shadow-md transition-all cursor-pointer" : ""}
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
    <h3 className={`text-base font-semibold text-midnight ${className}`}>
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
      className={`flex items-center justify-between gap-4 pt-4 border-t border-gray-100 ${className}`}
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

// StatCard - for displaying metrics
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
  iconColor?: "viking" | "red" | "amber" | "green" | "blue" | "gray";
  className?: string;
  onClick?: () => void;
}

const iconColorStyles = {
  viking: "bg-viking-100 text-viking-600",
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
};

const trendColorStyles = {
  up: "text-green-600",
  down: "text-red-600",
  neutral: "text-gray-500",
};

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconColor = "viking",
  className = "",
  onClick,
}: StatCardProps) {
  return (
    <Card
      className={className}
      hover={!!onClick}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {icon && (
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColorStyles[iconColor]}`}
              >
                <span className="w-4 h-4">{icon}</span>
              </div>
            )}
            <span className="text-sm text-gray-500">{title}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-midnight">{value}</span>
            {trend && (
              <span
                className={`text-sm font-medium ${trendColorStyles[trend.direction]}`}
              >
                {trend.direction === "up" && "↑"}
                {trend.direction === "down" && "↓"}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-xs text-gray-500 mt-1">{subtitle}</span>
          )}
        </div>
        {/* Optional secondary icon on the right */}
        <div className="w-8 h-8 text-gray-200">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}
