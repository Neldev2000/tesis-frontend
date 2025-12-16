import type { ReactNode } from "react";

// 2025 Design: DENSE, TECHNICAL table (Bloomberg/Linear style)
// - Compact vertical padding - information density is key
// - Almost invisible dividers - subtle, not chunky
// - Monospace numbers for data credibility
// - Feels like a professional tool, not a marketing page

interface TableProps {
  children: ReactNode;
  className?: string;
  /** Dense mode for maximum information density */
  dense?: boolean;
}

function TableRoot({ children, className = "", dense = false }: TableProps) {
  return (
    <div className={`overflow-x-auto ${dense ? "dense-mode" : ""} ${className}`}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead className={`border-b border-slate-200/60 ${className}`}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

function TableBody({ children, className = "" }: TableBodyProps) {
  // Almost invisible dividers - just enough visual separation
  return <tbody className={`divide-y divide-slate-100/50 ${className}`}>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

function TableRow({ children, className = "", onClick, selected }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`
        transition-colors duration-100
        ${onClick ? "cursor-pointer hover:bg-slate-50/70 group" : ""}
        ${selected ? "bg-viking-50/40" : ""}
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  align?: "left" | "center" | "right";
}

function TableHead({
  children,
  className = "",
  sortable,
  sortDirection,
  onSort,
  align = "left",
}: TableHeadProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={`
        px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider
        ${alignClasses[align]}
        ${sortable ? "cursor-pointer hover:text-slate-700 select-none" : ""}
        ${className}
      `}
    >
      <div className={`inline-flex items-center gap-1.5 ${align === "right" ? "flex-row-reverse" : ""}`}>
        {children}
        {sortable && (
          <span className="w-3 h-3 flex items-center justify-center">
            {sortDirection === "asc" && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            )}
            {sortDirection === "desc" && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            )}
            {!sortDirection && (
              <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

function TableCell({ children, className = "", align = "left" }: TableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td className={`px-3 py-2 text-sm text-slate-700 ${alignClasses[align]} ${className}`}>
      {children}
    </td>
  );
}

// Checkbox cell for selection
interface TableCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
}

function TableCheckbox({ checked, onChange, indeterminate, className = "" }: TableCheckboxProps) {
  return (
    <td className={`px-3 py-2 w-8 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate || false;
        }}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded border-slate-300 text-viking-600 focus:ring-viking-500/20 focus:ring-offset-0 cursor-pointer"
      />
    </td>
  );
}

// Row action indicator (chevron) - shows on hover for clickable rows
// Use as last cell in a row to indicate it's clickable
function TableRowAction({ className = "" }: { className?: string }) {
  return (
    <td className={`px-2 py-2 w-6 text-right ${className}`}>
      <svg
        className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors ml-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </td>
  );
}

// Empty state for tables
interface TableEmptyProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  colSpan?: number;
}

function TableEmpty({
  icon,
  title = "No data",
  description,
  action,
  colSpan = 1,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          {icon ? (
            <div className="w-10 h-10 text-gray-300 mb-3">{icon}</div>
          ) : (
            <svg
              className="w-10 h-10 text-gray-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          )}
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1 max-w-sm">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </td>
    </tr>
  );
}

// Pagination component - Mercury style
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Show simple "< >" navigation only */
  simple?: boolean;
}

function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  simple = false,
}: TablePaginationProps) {
  const showItemCount = totalItems !== undefined && itemsPerPage !== undefined;
  const startItem = showItemCount ? (currentPage - 1) * itemsPerPage! + 1 : 0;
  const endItem = showItemCount ? Math.min(currentPage * itemsPerPage!, totalItems!) : 0;

  if (simple) {
    return (
      <div className={`flex items-center justify-between px-3 py-2 border-t border-slate-100/50 ${className}`}>
        <span className="text-xs text-slate-500 font-mono">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100/70 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100/70 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className={`flex items-center justify-between px-3 py-2 border-t border-slate-100/50 ${className}`}>
      {showItemCount ? (
        <span className="text-xs text-slate-500">
          <span className="text-slate-700 font-medium font-mono">{startItem}–{endItem}</span> of {totalItems}
        </span>
      ) : (
        <span className="text-xs text-slate-500 font-mono">
          {currentPage}/{totalPages}
        </span>
      )}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100/70 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1 text-slate-400 text-xs">
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                min-w-[24px] h-6 px-1.5 text-xs font-medium rounded transition-colors font-mono
                ${
                  currentPage === page
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-100/70"
                }
              `}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100/70 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Export as compound component
export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Checkbox: TableCheckbox,
  RowAction: TableRowAction,
  Empty: TableEmpty,
  Pagination: TablePagination,
});
