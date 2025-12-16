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

// 2025 Design: More subtle, refined button styles
// - Softer shadows and borders
// - Muted color tones
// - Refined hover states with subtle transforms
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-viking-600 text-white
    hover:bg-viking-700
    active:bg-viking-800
    focus-visible:ring-2 focus-visible:ring-viking-500/30 focus-visible:ring-offset-1
  `,
  secondary: `
    bg-white text-gray-700
    border border-gray-200
    hover:bg-gray-50 hover:border-gray-300
    active:bg-gray-100
    focus-visible:ring-2 focus-visible:ring-gray-400/20 focus-visible:ring-offset-1
  `,
  soft: `
    bg-viking-50 text-viking-700
    hover:bg-viking-100
    active:bg-viking-150
    focus-visible:ring-2 focus-visible:ring-viking-500/20 focus-visible:ring-offset-1
  `,
  ghost: `
    bg-transparent text-gray-600
    hover:bg-gray-100/80 hover:text-gray-900
    active:bg-gray-200/60
    focus-visible:ring-2 focus-visible:ring-gray-400/20 focus-visible:ring-offset-1
  `,
  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    active:bg-red-800
    focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-1
  `,
  success: `
    bg-emerald-600 text-white
    hover:bg-emerald-700
    active:bg-emerald-800
    focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-1
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5",
  sm: "h-8 px-3 text-sm gap-1.5",
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
          rounded-xl
          transition-all duration-150 ease-out
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
          rounded-xl
          transition-all duration-150 ease-out
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
