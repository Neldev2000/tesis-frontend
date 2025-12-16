import { useState, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  tag?: string;
  tagVariant?: "default" | "success" | "warning";
  href?: string;
}

interface SearchCategory {
  label: string;
  results: SearchResult[];
}

interface SearchFilter {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  categories?: SearchCategory[];
  filters?: SearchFilter[];
  placeholder?: string;
  recentSearches?: SearchResult[];
  isLoading?: boolean;
}

const defaultFilters: SearchFilter[] = [
  {
    id: "sort",
    label: "Sort",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
  },
  {
    id: "type",
    label: "Type",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" />
      </svg>
    ),
  },
  {
    id: "date",
    label: "Date",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
];

function SearchInput({
  value,
  onChange,
  onClear,
  placeholder,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="relative flex items-center gap-3 px-4 py-3 border-b border-gray-100">
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-base text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
        autoComplete="off"
      />
      {value && (
        <button
          onClick={onClear}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

function FilterBar({ filters }: { filters: SearchFilter[] }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 overflow-x-auto">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
        >
          {filter.icon}
          <span>{filter.label}</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ResultItem({
  result,
  isSelected,
  onClick,
}: {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}) {
  const tagColors = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
        ${isSelected ? "bg-viking-50" : "hover:bg-gray-50"}
      `}
    >
      <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
        {result.icon || (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">{result.title}</span>
          {result.tag && (
            <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${tagColors[result.tagVariant || "default"]}`}>
              {result.tag}
            </span>
          )}
        </div>
        {result.subtitle && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{result.subtitle}</p>
        )}
      </div>
      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}

function CategorySection({
  category,
  selectedIndex,
  startIndex,
  onSelect,
}: {
  category: SearchCategory;
  selectedIndex: number;
  startIndex: number;
  onSelect: (result: SearchResult) => void;
}) {
  return (
    <div className="py-2">
      <div className="px-4 py-1.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {category.label}
        </span>
      </div>
      {category.results.map((result, idx) => (
        <ResultItem
          key={result.id}
          result={result}
          isSelected={selectedIndex === startIndex + idx}
          onClick={() => onSelect(result)}
        />
      ))}
    </div>
  );
}

function KeyboardHints() {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">↑↓</kbd>
        <span>Navigate</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">↵</kbd>
        <span>Open</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">Esc</kbd>
        <span>Close</span>
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-900">
        {query ? `No results for "${query}"` : "Start typing to search"}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {query ? "Try different keywords or filters" : "Search patients, appointments, inventory..."}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-8 h-8 border-2 border-viking-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm text-gray-500">Searching...</p>
    </div>
  );
}

export function SearchDialog({
  open,
  onClose,
  onSearch,
  onSelect,
  categories = [],
  filters = defaultFilters,
  placeholder = "Search patients, appointments, inventory...",
  recentSearches = [],
  isLoading = false,
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate total results for keyboard navigation
  const allResults = categories.flatMap((cat) => cat.results);
  const totalResults = allResults.length;

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Handle search query changes
  useEffect(() => {
    onSearch?.(query);
  }, [query, onSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(totalResults, 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + Math.max(totalResults, 1)) % Math.max(totalResults, 1));
          break;
        case "Enter":
          e.preventDefault();
          if (allResults[selectedIndex]) {
            onSelect?.(allResults[selectedIndex]);
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, totalResults, allResults, onSelect, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Calculate start indices for each category
  let currentStartIndex = 0;
  const categoryStartIndices = categories.map((cat) => {
    const startIndex = currentStartIndex;
    currentStartIndex += cat.results.length;
    return startIndex;
  });

  // Show recent searches if no query and we have them
  const displayCategories = query
    ? categories
    : recentSearches.length > 0
      ? [{ label: "Recent", results: recentSearches }]
      : [];

  return createPortal(
    <div
      className="flex items-end sm:items-start justify-center sm:pt-[15vh]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        isolation: "isolate",
      }}
    >
      {/* Backdrop */}
      <div
        className="bg-gray-900/60 animate-in fade-in duration-200"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          WebkitBackdropFilter: "blur(4px)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog - drawer on mobile, modal on desktop */}
      <div
        className="relative w-full sm:max-w-2xl bg-white shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-xl animate-in fade-in dialog-panel duration-200"
        role="dialog"
        aria-modal="true"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Drag handle - visible only on mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder={placeholder}
          inputRef={inputRef}
        />

        <FilterBar filters={filters} />

        <div className="max-h-[50vh] sm:max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <LoadingState />
          ) : displayCategories.length > 0 ? (
            displayCategories.map((category, catIdx) => (
              <CategorySection
                key={category.label}
                category={category}
                selectedIndex={selectedIndex}
                startIndex={categoryStartIndices[catIdx] ?? 0}
                onSelect={(result) => {
                  onSelect?.(result);
                  onClose();
                }}
              />
            ))
          ) : (
            <EmptyState query={query} />
          )}
        </div>

        <KeyboardHints />
      </div>
    </div>,
    document.body
  );
}
