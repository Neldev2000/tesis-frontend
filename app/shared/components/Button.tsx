import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "soft";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

// 2025 Design: PREMIUM button styles with micro-textures
// - Subtle gradient shine on solid buttons (not flat)
// - Structured, technical look (less rounded than typical)
// - Desaturated, sophisticated colors
// - Visible but subtle borders for depth
const variantStyles: Record<ButtonVariant, string> = {
  // Primary: Solid with subtle shine gradient
  primary: `
    bg-viking-600 text-white btn-shine
    border border-viking-700/20
    shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.1)]
    hover:bg-viking-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.12)]
    active:bg-viking-800 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
    focus-visible:ring-2 focus-visible:ring-viking-500/40 focus-visible:ring-offset-1
  `,
  // Secondary: Clean border, subtle depth
  secondary: `
    bg-white text-slate-700
    border border-slate-200
    shadow-[0_1px_2px_rgba(0,0,0,0.04)]
    hover:bg-slate-50 hover:border-slate-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06)]
    active:bg-slate-100 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]
    focus-visible:ring-2 focus-visible:ring-slate-400/20 focus-visible:ring-offset-1
  `,
  // Soft: Muted background
  soft: `
    bg-viking-50/80 text-viking-700
    border border-viking-100/50
    hover:bg-viking-100/80 hover:border-viking-200/50
    active:bg-viking-150
    focus-visible:ring-2 focus-visible:ring-viking-500/20 focus-visible:ring-offset-1
  `,
  // Ghost: Minimal, technical
  ghost: `
    bg-transparent text-slate-600
    hover:bg-slate-100/70 hover:text-slate-800
    active:bg-slate-200/50
    focus-visible:ring-2 focus-visible:ring-slate-400/20 focus-visible:ring-offset-1
  `,
  // Danger: Solid with shine
  danger: `
    bg-red-600 text-white btn-shine
    border border-red-700/20
    shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.1)]
    hover:bg-red-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.12)]
    active:bg-red-800
    focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-1
  `,
  // Success: Solid with shine
  success: `
    bg-emerald-600 text-white btn-shine
    border border-emerald-700/20
    shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.1)]
    hover:bg-emerald-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.12)]
    active:bg-emerald-800
    focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-1
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5",
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-4 h-4",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium
          rounded-lg
          transition-all duration-100 ease-out
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          select-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className={`animate-spin ${iconSizeStyles[size]}`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className={`flex-shrink-0 ${iconSizeStyles[size]}`}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className={`flex-shrink-0 ${iconSizeStyles[size]}`}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icon-only button variant for compact actions
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string; // For accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = "ghost",
      size = "md",
      label,
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<ButtonSize, string> = {
      xs: "w-7 h-7",
      sm: "w-8 h-8",
      md: "w-9 h-9",
      lg: "w-10 h-10",
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={`
          inline-flex items-center justify-center
          rounded-lg
          transition-all duration-100 ease-out
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        <span className={iconSizeStyles[size]}>{icon}</span>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
