import type { ReactNode } from "react";

type TagVariant = "default" | "primary" | "outline";
type TagSize = "sm" | "md";

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  default: "bg-slate-100 text-slate-700 hover:bg-slate-200/80",
  primary: "bg-slate-700 text-white hover:bg-slate-800",
  outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50",
};

const sizeStyles: Record<TagSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-sm gap-1.5",
};

export function Tag({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  className = "",
}: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-md transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 p-0.5 rounded hover:bg-black/10 transition-colors"
          aria-label="Remove"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Filter pill - clickable filter option
interface FilterPillProps {
  children: ReactNode;
  active?: boolean;
  icon?: ReactNode;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function FilterPill({
  children,
  active = false,
  icon,
  count,
  onClick,
  className = "",
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md
        transition-colors whitespace-nowrap
        ${
          active
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
        }
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
      {count !== undefined && (
        <span
          className={`
            ml-1 px-1.5 py-0.5 text-xs font-medium rounded
            ${active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"}
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// Category tag - for displaying categories like diagnosis
interface CategoryTagProps {
  children: ReactNode;
  color?: "gray" | "blue" | "green" | "red" | "amber" | "purple" | "pink";
  className?: string;
}

// Muted category colors - all slate-based for consistency
const categoryColors: Record<string, string> = {
  gray: "bg-slate-100 text-slate-600",
  blue: "bg-slate-100 text-slate-600",
  green: "bg-slate-100 text-slate-600",
  red: "bg-slate-100 text-slate-600",
  amber: "bg-slate-100 text-slate-600",
  purple: "bg-slate-100 text-slate-600",
  pink: "bg-slate-100 text-slate-600",
};

export function CategoryTag({
  children,
  color = "gray",
  className = "",
}: CategoryTagProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs font-medium rounded
        ${categoryColors[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
