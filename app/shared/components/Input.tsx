import {
  forwardRef,
  useState,
  useCallback,
  type InputHTMLAttributes,
  type ReactNode,
  type ChangeEvent,
} from "react";

// 2025 Design: Refined input styles
// - Softer focus states with slate palette
// - Cleaner borders
// - Better visual hierarchy
// - React Hook Form compatible (forwardRef + onChange/value)

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  inputSize?: InputSize;
  /** Make label and input inline */
  inline?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-sm",
};

const iconPadding: Record<InputSize, { left: string; right: string }> = {
  sm: { left: "pl-8", right: "pr-8" },
  md: { left: "pl-9", right: "pr-9" },
  lg: { left: "pl-10", right: "pr-10" },
};

const iconSize: Record<InputSize, string> = {
  sm: "w-4 h-4",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const iconPositionStyles: Record<InputSize, { left: string; right: string }> = {
  sm: { left: "left-2.5", right: "right-2.5" },
  md: { left: "left-3", right: "right-3" },
  lg: { left: "left-3", right: "right-3" },
};

// Base input classes - muted slate palette
const baseInputClasses = `
  w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
  transition-all duration-150
  focus:outline-none
`;

const getStateClasses = (error?: string) =>
  error
    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const disabledClasses =
  "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:border-slate-200";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition: position = "left",
      inputSize = "md",
      inline = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const inputElement = (
      <div className="relative flex-1">
        {icon && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${iconPositionStyles[inputSize][position]} text-slate-400 pointer-events-none`}
          >
            <span className={iconSize[inputSize]}>{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            ${baseInputClasses}
            ${sizeStyles[inputSize]}
            ${icon ? iconPadding[inputSize][position] : ""}
            ${getStateClasses(error)}
            ${disabledClasses}
            ${className}
          `}
          {...props}
        />
      </div>
    );

    if (inline && label) {
      return (
        <div className="w-full">
          <div className="flex items-center gap-3">
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-slate-700 whitespace-nowrap"
            >
              {label}
            </label>
            {inputElement}
          </div>
          {(error || hint) && (
            <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
              {error || hint}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        {inputElement}
        {(error || hint) && (
          <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ============================================================================
// NumberInput - For numeric values with optional formatting
// ============================================================================

interface NumberInputProps extends Omit<InputProps, "type" | "onChange" | "value"> {
  value?: number | string;
  onChange?: (value: number | undefined, event: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  /** Show increment/decrement buttons */
  showControls?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      allowDecimals = true,
      showControls = false,
      inputSize = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        if (rawValue === "" || rawValue === "-") {
          onChange?.(undefined, e);
          return;
        }
        const numValue = allowDecimals ? parseFloat(rawValue) : parseInt(rawValue, 10);
        if (!isNaN(numValue)) {
          onChange?.(numValue, e);
        }
      },
      [onChange, allowDecimals]
    );

    const increment = useCallback(() => {
      const currentValue = typeof value === "number" ? value : 0;
      const newValue = currentValue + step;
      if (max === undefined || newValue <= max) {
        onChange?.(newValue, {} as ChangeEvent<HTMLInputElement>);
      }
    }, [value, step, max, onChange]);

    const decrement = useCallback(() => {
      const currentValue = typeof value === "number" ? value : 0;
      const newValue = currentValue - step;
      if (min === undefined || newValue >= min) {
        onChange?.(newValue, {} as ChangeEvent<HTMLInputElement>);
      }
    }, [value, step, min, onChange]);

    if (showControls) {
      return (
        <div className="w-full">
          {props.label && (
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {props.label}
            </label>
          )}
          <div className="flex">
            <button
              type="button"
              onClick={decrement}
              className="px-3 border border-r-0 border-slate-200 rounded-l-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              disabled={props.disabled || (min !== undefined && (value as number) <= min)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <input
              ref={ref}
              type="text"
              inputMode={allowDecimals ? "decimal" : "numeric"}
              value={value ?? ""}
              onChange={handleChange}
              className={`
                flex-1 border-y border-slate-200 bg-white text-slate-900 text-center
                ${sizeStyles[inputSize]}
                ${getStateClasses(props.error)}
                focus:outline-none focus:z-10 focus:relative
                ${className}
              `}
              {...props}
            />
            <button
              type="button"
              onClick={increment}
              className="px-3 border border-l-0 border-slate-200 rounded-r-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              disabled={props.disabled || (max !== undefined && (value as number) >= max)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          {(props.error || props.hint) && (
            <p className={`mt-1.5 text-xs ${props.error ? "text-red-600" : "text-slate-500"}`}>
              {props.error || props.hint}
            </p>
          )}
        </div>
      );
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode={allowDecimals ? "decimal" : "numeric"}
        value={value ?? ""}
        onChange={handleChange as unknown as React.ChangeEventHandler<HTMLInputElement>}
        inputSize={inputSize}
        className={className}
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

// ============================================================================
// CurrencyInput - For monetary values
// ============================================================================

interface CurrencyInputProps extends Omit<InputProps, "type" | "onChange" | "value"> {
  value?: number | string;
  onChange?: (value: number | undefined, event: ChangeEvent<HTMLInputElement>) => void;
  currency?: string;
  locale?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currency = "USD", locale = "en-US", inputSize = "md", ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => {
      if (value === undefined || value === "") return "";
      return typeof value === "number" ? value.toString() : value;
    });

    const currencySymbol = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || "$";

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^\d.]/g, "");
        setDisplayValue(rawValue);

        if (rawValue === "") {
          onChange?.(undefined, e);
          return;
        }

        const numValue = parseFloat(rawValue);
        if (!isNaN(numValue)) {
          onChange?.(numValue, e);
        }
      },
      [onChange]
    );

    const handleBlur = useCallback(() => {
      if (displayValue && !isNaN(parseFloat(displayValue))) {
        const formatted = parseFloat(displayValue).toFixed(2);
        setDisplayValue(formatted);
      }
    }, [displayValue]);

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange as unknown as React.ChangeEventHandler<HTMLInputElement>}
        onBlur={handleBlur}
        inputSize={inputSize}
        icon={<span className="text-slate-500 text-sm font-medium">{currencySymbol}</span>}
        iconPosition="left"
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

// ============================================================================
// PhoneInput - For phone numbers with formatting
// ============================================================================

interface PhoneInputProps extends Omit<InputProps, "type" | "onChange" | "value"> {
  value?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Country code format */
  format?: "US" | "international";
}

const formatPhoneUS = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, format = "US", inputSize = "md", ...props }, ref) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const digits = rawValue.replace(/\D/g, "");
        const formatted = format === "US" ? formatPhoneUS(rawValue) : digits;
        onChange?.(formatted, e);
      },
      [onChange, format]
    );

    return (
      <Input
        ref={ref}
        type="tel"
        value={value}
        onChange={handleChange as unknown as React.ChangeEventHandler<HTMLInputElement>}
        inputSize={inputSize}
        placeholder={format === "US" ? "(555) 555-5555" : "+1 555 555 5555"}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
        }
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

// ============================================================================
// EmailInput - For email addresses with validation icon
// ============================================================================

interface EmailInputProps extends Omit<InputProps, "type"> {
  showValidation?: boolean;
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ showValidation = true, value, inputSize = "md", ...props }, ref) => {
    const isValid = value && typeof value === "string" && isValidEmail(value);

    return (
      <Input
        ref={ref}
        type="email"
        value={value}
        inputSize={inputSize}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        }
        iconPosition="left"
        className={showValidation && value ? (isValid ? "pr-9" : "") : ""}
        {...props}
      />
    );
  }
);

EmailInput.displayName = "EmailInput";

// ============================================================================
// PasswordInput - With show/hide toggle
// ============================================================================

interface PasswordInputProps extends Omit<InputProps, "type"> {
  showStrength?: boolean;
}

const getPasswordStrength = (password: string): { level: number; label: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Weak" };
  if (score <= 2) return { level: 2, label: "Fair" };
  if (score <= 3) return { level: 3, label: "Good" };
  return { level: 4, label: "Strong" };
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, value, inputSize = "md", className = "", label, error, hint, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const strength = value && typeof value === "string" ? getPasswordStrength(value) : null;

    const strengthColors = {
      1: "bg-red-500",
      2: "bg-amber-500",
      3: "bg-emerald-400",
      4: "bg-emerald-600",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            className={`
              ${baseInputClasses}
              ${sizeStyles[inputSize]}
              pr-10
              ${getStateClasses(error)}
              ${disabledClasses}
              ${className}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>
        {showStrength && strength && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    level <= strength.level ? strengthColors[strength.level as 1 | 2 | 3 | 4] : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">{strength.label}</p>
          </div>
        )}
        {(error || hint) && !showStrength && (
          <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

// ============================================================================
// DateInput - Native date picker with styling
// ============================================================================

interface DateInputProps extends Omit<InputProps, "type"> {
  /** Date format for display */
  displayFormat?: "short" | "medium" | "long";
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ inputSize = "md", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        inputSize={inputSize}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";

// ============================================================================
// TimeInput - Native time picker
// ============================================================================

interface TimeInputProps extends Omit<InputProps, "type"> {}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ inputSize = "md", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="time"
        inputSize={inputSize}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
        {...props}
      />
    );
  }
);

TimeInput.displayName = "TimeInput";

// ============================================================================
// SearchInput - With clear button
// ============================================================================

interface SearchInputProps extends Omit<InputProps, "icon" | "iconPosition"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, inputSize = "md", className = "", ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          value={value}
          inputSize={inputSize}
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          }
          iconPosition="left"
          className={`${value && onClear ? "pr-9" : ""} ${className}`}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1/2 -translate-y-1/2 right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

// ============================================================================
// Textarea
// ============================================================================

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  textareaSize?: InputSize;
  /** Auto-resize based on content */
  autoResize?: boolean;
}

const textareaSizeStyles: Record<InputSize, string> = {
  sm: "px-2.5 py-2 text-sm",
  md: "px-3 py-2.5 text-sm",
  lg: "px-3.5 py-3 text-sm",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      textareaSize = "md",
      autoResize = false,
      className = "",
      id,
      rows = 3,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoResize) {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }
        onChange?.(e);
      },
      [autoResize, onChange]
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          onChange={handleChange}
          className={`
            w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
            transition-all duration-150
            focus:outline-none
            ${autoResize ? "resize-none overflow-hidden" : "resize-y"}
            ${textareaSizeStyles[textareaSize]}
            ${getStateClasses(error)}
            ${disabledClasses}
            ${className}
          `}
          {...props}
        />
        {(error || hint) && (
          <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// ============================================================================
// Checkbox
// ============================================================================

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  error?: string;
  checkboxSize?: "sm" | "md" | "lg";
}

const checkboxSizeStyles = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, checkboxSize = "md", className = "", id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`
            ${checkboxSizeStyles[checkboxSize]}
            rounded border-slate-300 text-slate-900
            focus:ring-2 focus:ring-slate-200 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-300" : ""}
            ${className}
          `}
          {...props}
        />
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label htmlFor={checkboxId} className="text-sm font-medium text-slate-700 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            )}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

// ============================================================================
// Radio
// ============================================================================

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  orientation?: "horizontal" | "vertical";
  radioSize?: "sm" | "md" | "lg";
}

const radioSizeStyles = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  orientation = "vertical",
  radioSize = "md",
}: RadioGroupProps) {
  return (
    <fieldset className="w-full">
      {label && (
        <legend className="text-sm font-medium text-slate-700 mb-2">{label}</legend>
      )}
      <div className={`flex ${orientation === "vertical" ? "flex-col gap-2" : "flex-wrap gap-4"}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 cursor-pointer ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              className={`
                ${radioSizeStyles[radioSize]}
                border-slate-300 text-slate-900
                focus:ring-2 focus:ring-slate-200 focus:ring-offset-0
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-700">{option.label}</span>
              {option.description && (
                <p className="text-sm text-slate-500 mt-0.5">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </fieldset>
  );
}

// ============================================================================
// Switch / Toggle
// ============================================================================

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  switchSize?: "sm" | "md" | "lg";
}

const switchSizeStyles = {
  sm: { track: "w-8 h-4", thumb: "w-3 h-3", translateOn: "translate-x-4", translateOff: "translate-x-0" },
  md: { track: "w-10 h-5", thumb: "w-4 h-4", translateOn: "translate-x-5", translateOff: "translate-x-0" },
  lg: { track: "w-12 h-6", thumb: "w-5 h-5", translateOn: "translate-x-6", translateOff: "translate-x-0" },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, switchSize = "md", checked, onChange, disabled, className = "", id, ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const sizes = switchSizeStyles[switchSize];

    return (
      <label
        htmlFor={switchId}
        className={`flex items-start gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`
              ${sizes.track}
              rounded-full transition-colors
              ${checked ? "bg-slate-900" : "bg-slate-200"}
              ${className}
            `}
          />
          <div
            className={`
              absolute top-0.5 left-0.5
              ${sizes.thumb}
              rounded-full bg-white shadow-sm
              transition-transform duration-200
              ${checked ? sizes.translateOn : sizes.translateOff}
            `}
          />
        </div>
        {(label || description) && (
          <div className="flex-1 pt-0.5">
            {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";
