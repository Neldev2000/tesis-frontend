import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

// 2025 Design: Clean select components
// - Muted slate palette
// - Smooth animations
// - React Hook Form compatible

type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface BaseSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  selectSize?: SelectSize;
  className?: string;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-sm",
};

const baseSelectClasses = `
  w-full rounded-lg border bg-white text-slate-900
  transition-all duration-150
  focus:outline-none
  cursor-pointer
`;

const getStateClasses = (error?: string, isOpen?: boolean) => {
  if (error) return "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100";
  if (isOpen) return "border-slate-400 ring-2 ring-slate-100";
  return "border-slate-200 hover:border-slate-300";
};

const disabledClasses =
  "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:border-slate-200";

// ============================================================================
// Native Select (simple dropdown)
// ============================================================================

interface NativeSelectProps extends BaseSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export const Select = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      selectSize = "md",
      placeholder,
      className = "",
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = props.name || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className={`
              ${baseSelectClasses}
              ${sizeStyles[selectSize]}
              ${getStateClasses(error)}
              ${disabledClasses}
              appearance-none pr-9
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
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute top-1/2 -translate-y-1/2 right-2.5 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {(error || hint) && (
          <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

// ============================================================================
// Combobox (Searchable Select)
// ============================================================================

interface ComboboxProps extends BaseSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string | undefined) => void;
  onSearch?: (query: string) => void;
  /** Allow custom value not in options */
  allowCustom?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  name?: string;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      label,
      error,
      hint,
      options,
      value,
      onChange,
      onSearch,
      placeholder = "Search...",
      selectSize = "md",
      allowCustom = false,
      clearable = true,
      loading = false,
      emptyMessage = "No results found",
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Find selected option
    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value]
    );

    // Filter options based on query
    const filteredOptions = useMemo(() => {
      if (!query) return options;
      const lowerQuery = query.toLowerCase();
      return options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(lowerQuery) ||
          opt.description?.toLowerCase().includes(lowerQuery)
      );
    }, [options, query]);

    // Update dropdown position
    useEffect(() => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = Math.min(filteredOptions.length * 40 + 8, 240);
        const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

        setDropdownStyle({
          position: "fixed",
          left: rect.left,
          width: rect.width,
          ...(showAbove
            ? { bottom: window.innerHeight - rect.top + 4 }
            : { top: rect.bottom + 4 }),
          zIndex: 9999,
        });
      }
    }, [isOpen, filteredOptions.length]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setQuery("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset highlighted index when options change
    useEffect(() => {
      setHighlightedIndex(0);
    }, [filteredOptions]);

    const handleSelect = useCallback(
      (option: SelectOption) => {
        onChange?.(option.value);
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
      },
      [onChange]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(undefined);
        setQuery("");
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
              );
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (isOpen && filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex]);
            } else if (allowCustom && query) {
              onChange?.(query);
              setIsOpen(false);
              setQuery("");
            }
            break;
          case "Escape":
            setIsOpen(false);
            setQuery("");
            break;
          case "Tab":
            setIsOpen(false);
            setQuery("");
            break;
        }
      },
      [isOpen, filteredOptions, highlightedIndex, handleSelect, allowCustom, query, onChange]
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        onSearch?.(newQuery);
        if (!isOpen) setIsOpen(true);
      },
      [onSearch, isOpen]
    );

    const inputId = props.name || label?.toLowerCase().replace(/\s+/g, "-");

    const dropdownContent = isOpen && (
      <ul
        ref={listRef}
        style={dropdownStyle}
        className="bg-white rounded-lg border border-slate-200 shadow-lg overflow-auto max-h-60"
        role="listbox"
      >
        {loading ? (
          <li className="px-3 py-2 text-sm text-slate-500 flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </li>
        ) : filteredOptions.length === 0 ? (
          <li className="px-3 py-2 text-sm text-slate-500">{emptyMessage}</li>
        ) : (
          filteredOptions.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => !option.disabled && handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                px-3 py-2 cursor-pointer transition-colors
                ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${index === highlightedIndex ? "bg-slate-100" : ""}
                ${option.value === value ? "bg-slate-50" : ""}
              `}
            >
              <div className="flex items-center gap-2">
                {option.icon && <span className="w-4 h-4 text-slate-400">{option.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-slate-500 truncate">{option.description}</div>
                  )}
                </div>
                {option.value === value && (
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    );

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={inputId}
            type="text"
            value={isOpen ? query : selectedOption?.label || ""}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={`
              ${baseSelectClasses}
              ${sizeStyles[selectSize]}
              ${getStateClasses(error, isOpen)}
              ${disabledClasses}
              pr-16
              ${className}
            `}
            {...props}
          />
          <div className="absolute top-1/2 -translate-y-1/2 right-2.5 flex items-center gap-1">
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {(error || hint) && (
          <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error || hint}
          </p>
        )}
        {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
      </div>
    );
  }
);

Combobox.displayName = "Combobox";

// ============================================================================
// MultiSelect
// ============================================================================

interface MultiSelectProps extends BaseSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  /** Maximum number of selections */
  maxSelections?: number;
  /** Show selected items as tags */
  showTags?: boolean;
  /** Allow search/filter */
  searchable?: boolean;
  name?: string;
}

export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      value = [],
      onChange,
      placeholder = "Select options...",
      selectSize = "md",
      maxSelections,
      showTags = true,
      searchable = true,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Filter options
    const filteredOptions = useMemo(() => {
      if (!query) return options;
      const lowerQuery = query.toLowerCase();
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(lowerQuery)
      );
    }, [options, query]);

    // Get selected options
    const selectedOptions = useMemo(
      () => options.filter((opt) => value.includes(opt.value)),
      [options, value]
    );

    // Update dropdown position
    useEffect(() => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = Math.min(filteredOptions.length * 40 + 8, 240);
        const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

        setDropdownStyle({
          position: "fixed",
          left: rect.left,
          width: rect.width,
          ...(showAbove
            ? { bottom: window.innerHeight - rect.top + 4 }
            : { top: rect.bottom + 4 }),
          zIndex: 9999,
        });
      }
    }, [isOpen, filteredOptions.length]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        const isInsideContainer = containerRef.current?.contains(target);
        const isInsideDropdown = listRef.current?.contains(target);

        if (!isInsideContainer && !isInsideDropdown) {
          setIsOpen(false);
          setQuery("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = useCallback(
      (optionValue: string) => {
        const isSelected = value.includes(optionValue);
        if (isSelected) {
          onChange?.(value.filter((v) => v !== optionValue));
        } else if (!maxSelections || value.length < maxSelections) {
          onChange?.([...value, optionValue]);
        }
      },
      [value, onChange, maxSelections]
    );

    const handleRemove = useCallback(
      (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(value.filter((v) => v !== optionValue));
      },
      [value, onChange]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
              );
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (isOpen && filteredOptions[highlightedIndex]) {
              handleToggle(filteredOptions[highlightedIndex].value);
            }
            break;
          case "Escape":
            setIsOpen(false);
            setQuery("");
            break;
          case "Backspace":
            if (!query && value.length > 0) {
              onChange?.(value.slice(0, -1));
            }
            break;
        }
      },
      [isOpen, filteredOptions, highlightedIndex, handleToggle, query, value, onChange]
    );

    const inputId = props.name || label?.toLowerCase().replace(/\s+/g, "-");

    const dropdownContent = isOpen && (
      <ul
        ref={listRef}
        style={dropdownStyle}
        className="bg-white rounded-lg border border-slate-200 shadow-lg overflow-auto max-h-60"
        role="listbox"
      >
        {filteredOptions.length === 0 ? (
          <li className="px-3 py-2 text-sm text-slate-500">No results found</li>
        ) : (
          filteredOptions.map((option, index) => {
            const isSelected = value.includes(option.value);
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => !option.disabled && handleToggle(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  px-3 py-2 cursor-pointer transition-colors flex items-center gap-2
                  ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${index === highlightedIndex ? "bg-slate-100" : ""}
                `}
              >
                <div
                  className={`
                    w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                    ${isSelected ? "bg-slate-900 border-slate-900" : "border-slate-300"}
                  `}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                {option.icon && <span className="w-4 h-4 text-slate-400">{option.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-slate-500 truncate">{option.description}</div>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    );

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div
          onClick={() => !disabled && inputRef.current?.focus()}
          className={`
            min-h-9 rounded-lg border bg-white px-2 py-1.5
            flex flex-wrap items-center gap-1.5
            transition-all duration-150
            ${getStateClasses(error, isOpen)}
            ${disabled ? "bg-slate-50 cursor-not-allowed" : "cursor-text"}
            ${className}
          `}
        >
          {showTags && selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-sm rounded"
            >
              {option.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(option.value, e)}
                  className="p-0.5 hover:bg-slate-200 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}
          {searchable ? (
            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              id={inputId}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={selectedOptions.length === 0 ? placeholder : ""}
              disabled={disabled}
              autoComplete="off"
              className="flex-1 min-w-20 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              {...props}
            />
          ) : (
            <span
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className={`flex-1 text-sm ${selectedOptions.length === 0 ? "text-slate-400" : "text-slate-900"}`}
            >
              {selectedOptions.length === 0 ? placeholder : `${selectedOptions.length} selected`}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        {(error || hint) && (
          <p className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
            {error || hint}
          </p>
        )}
        {maxSelections && (
          <p className="mt-1 text-xs text-slate-400">
            {value.length}/{maxSelections} selected
          </p>
        )}
        {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

// ============================================================================
// Autocomplete (Text input with suggestions)
// ============================================================================

interface AutocompleteProps extends BaseSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
  name?: string;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      label,
      error,
      hint,
      options,
      value = "",
      onChange,
      onSearch,
      placeholder = "Type to search...",
      selectSize = "md",
      loading = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Filter options based on value
    const filteredOptions = useMemo(() => {
      if (!value) return [];
      const lowerValue = value.toLowerCase();
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(lowerValue)
      );
    }, [options, value]);

    // Update dropdown position
    useEffect(() => {
      if (isOpen && containerRef.current && filteredOptions.length > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: "fixed",
          left: rect.left,
          top: rect.bottom + 4,
          width: rect.width,
          zIndex: 9999,
        });
      }
    }, [isOpen, filteredOptions.length]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = useCallback(
      (option: SelectOption) => {
        onChange?.(option.label);
        setIsOpen(false);
      },
      [onChange]
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange?.(newValue);
        onSearch?.(newValue);
        setIsOpen(true);
      },
      [onChange, onSearch]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex]);
            }
            break;
          case "Escape":
            setIsOpen(false);
            break;
        }
      },
      [filteredOptions, highlightedIndex, handleSelect]
    );

    const inputId = props.name || label?.toLowerCase().replace(/\s+/g, "-");

    const dropdownContent = isOpen && filteredOptions.length > 0 && (
      <ul
        style={dropdownStyle}
        className="bg-white rounded-lg border border-slate-200 shadow-lg overflow-auto max-h-60"
      >
        {loading ? (
          <li className="px-3 py-2 text-sm text-slate-500 flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </li>
        ) : (
          filteredOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                px-3 py-2 cursor-pointer transition-colors text-sm
                ${index === highlightedIndex ? "bg-slate-100" : ""}
              `}
            >
              {option.label}
            </li>
          ))
        )}
      </ul>
    );

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`
            ${baseSelectClasses}
            ${sizeStyles[selectSize]}
            ${getStateClasses(error, isOpen)}
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
        {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
      </div>
    );
  }
);

Autocomplete.displayName = "Autocomplete";
