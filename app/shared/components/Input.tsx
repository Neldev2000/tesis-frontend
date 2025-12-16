import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

// 2025 Design: Refined input styles
// - Softer focus states
// - Cleaner borders
// - Better visual hierarchy

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  inputSize?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-sm",
};

const iconPadding = {
  sm: { left: "pl-8", right: "pr-8" },
  md: { left: "pl-9", right: "pr-9" },
  lg: { left: "pl-10", right: "pr-10" },
};

const iconSize = {
  sm: "w-4 h-4",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const iconPositionStyles = {
  sm: { left: "left-2.5", right: "right-2.5" },
  md: { left: "left-3", right: "right-3" },
  lg: { left: "left-3", right: "right-3" },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition: position = "left",
      inputSize = "md",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${iconPositionStyles[inputSize][position]} text-gray-400 pointer-events-none`}
            >
              <span className={iconSize[inputSize]}>{icon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-white text-gray-900 placeholder:text-gray-400
              transition-all duration-150
              focus:outline-none
              ${sizeStyles[inputSize]}
              ${icon ? iconPadding[inputSize][position] : ""}
              ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 hover:border-gray-300 focus:border-viking-500 focus:ring-2 focus:ring-viking-500/10"
              }
              disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:border-gray-200
              ${className}
            `}
            {...props}
          />
        </div>
        {(error || hint) && (
          <p
            className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-gray-500"}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Search input with built-in search icon
interface SearchInputProps extends Omit<InputProps, "icon" | "iconPosition"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, inputSize = "md", className = "", ...props }, ref) => {
    return (
      <div className="relative">
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
            className="absolute top-1/2 -translate-y-1/2 right-2.5 p-0.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
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

// Textarea component
interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  textareaSize?: "sm" | "md" | "lg";
}

const textareaSizeStyles = {
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
      className = "",
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            w-full rounded-xl border bg-white text-gray-900 placeholder:text-gray-400
            transition-all duration-150
            focus:outline-none resize-y
            ${textareaSizeStyles[textareaSize]}
            ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 hover:border-gray-300 focus:border-viking-500 focus:ring-2 focus:ring-viking-500/10"
            }
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:border-gray-200
            ${className}
          `}
          {...props}
        />
        {(error || hint) && (
          <p
            className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-gray-500"}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Select component with consistent styling
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  selectSize?: "sm" | "md" | "lg";
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      selectSize = "md",
      placeholder,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full rounded-xl border bg-white text-gray-900
              transition-all duration-150 appearance-none
              focus:outline-none
              pr-9
              ${sizeStyles[selectSize]}
              ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 hover:border-gray-300 focus:border-viking-500 focus:ring-2 focus:ring-viking-500/10"
              }
              disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute top-1/2 -translate-y-1/2 right-2.5 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {(error || hint) && (
          <p
            className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-gray-500"}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
