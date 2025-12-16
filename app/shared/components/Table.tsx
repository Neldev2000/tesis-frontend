import { type ReactNode, useState, useCallback } from "react";

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
    <thead className={`bg-slate-50 border-b border-slate-200 ${className}`}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

function TableBody({ children, className = "" }: TableBodyProps) {
  return <tbody className={`divide-y divide-slate-100 bg-white ${className}`}>{children}</tbody>;
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
  /** Called when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  /** Options for items per page selector */
  pageSizeOptions?: number[];
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
  onItemsPerPageChange,
  pageSizeOptions = [10, 50, 100],
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
      <div className="flex items-center gap-4">
        {showItemCount ? (
          <span className="text-xs text-slate-500">
            <span className="text-slate-700 font-medium font-mono">{startItem}–{endItem}</span> of {totalItems}
          </span>
        ) : (
          <span className="text-xs text-slate-500 font-mono">
            {currentPage}/{totalPages}
          </span>
        )}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-viking-500/30 focus:border-viking-500 cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
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

// ============================================================================
// EditableTable - For forms with dynamic rows (inventory, invoices, etc.)
// ============================================================================

export interface EditableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render: (
    value: T[keyof T],
    row: T,
    index: number,
    onChange: (key: keyof T, value: T[keyof T]) => void
  ) => ReactNode;
}

interface EditableTableProps<T> {
  columns: EditableColumn<T>[];
  data: T[];
  onChange: (data: T[]) => void;
  /** Function to create a new empty row */
  createRow: () => T;
  /** Maximum number of rows allowed */
  maxRows?: number;
  /** Minimum number of rows (prevents deletion below this) */
  minRows?: number;
  /** Add button label */
  addLabel?: string;
  /** Show row numbers */
  showRowNumbers?: boolean;
  /** Disable all editing */
  disabled?: boolean;
  className?: string;
}

export function EditableTable<T>({
  columns,
  data,
  onChange,
  createRow,
  maxRows,
  minRows = 0,
  addLabel = "Add row",
  showRowNumbers = false,
  disabled = false,
  className = "",
}: EditableTableProps<T>) {
  const handleAddRow = useCallback(() => {
    if (maxRows && data.length >= maxRows) return;
    onChange([...data, createRow()]);
  }, [data, onChange, createRow, maxRows]);

  const handleRemoveRow = useCallback(
    (index: number) => {
      if (data.length <= minRows) return;
      const newData = [...data];
      newData.splice(index, 1);
      onChange(newData);
    },
    [data, onChange, minRows]
  );

  const handleCellChange = useCallback(
    (index: number, key: keyof T, value: T[keyof T]) => {
      const newData = [...data];
      newData[index] = { ...newData[index], [key]: value };
      onChange(newData);
    },
    [data, onChange]
  );

  const canAddRow = !maxRows || data.length < maxRows;
  const canRemoveRow = data.length > minRows;

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {showRowNumbers && (
                <th className="px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center w-12">
                  #
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className={`px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-${col.align || "left"}`}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showRowNumbers ? 2 : 1)}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No items yet. Click "{addLabel}" to add one.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="group hover:bg-slate-50">
                  {showRowNumbers && (
                    <td className="px-3 py-2 text-xs text-slate-400 text-center tabular-nums">
                      {index + 1}
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-3 py-1.5 text-${col.align || "left"}`}
                    >
                      {col.render(row[col.key], row, index, (key, value) =>
                        handleCellChange(index, key, value)
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      disabled={disabled || !canRemoveRow}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0"
                      aria-label="Remove row"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={handleAddRow}
        disabled={disabled || !canAddRow}
        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}

// ============================================================================
// DataTable - Table with row actions (view, edit, delete)
// ============================================================================

export type RowAction<T> = {
  icon: ReactNode;
  label: string;
  onClick: (row: T, index: number) => void;
  variant?: "default" | "danger";
  /** Show only on hover */
  hoverOnly?: boolean;
};

export type BulkAction<T> = {
  icon: ReactNode;
  label: string;
  onClick: (selectedRows: T[]) => void;
  variant?: "default" | "danger" | "primary";
};

interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Row actions (edit, delete, etc.) */
  actions?: RowAction<T>[];
  /** Bulk actions when rows are selected */
  bulkActions?: BulkAction<T>[];
  /** Key to use for row identity */
  rowKey: keyof T;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row keys */
  selectedKeys?: (string | number)[];
  /** Called when selection changes */
  onSelectionChange?: (keys: (string | number)[]) => void;
  /** Called when row is clicked */
  onRowClick?: (row: T, index: number) => void;
  /** Sort configuration */
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  /** Called when sort changes */
  onSortChange?: (key: string, direction: "asc" | "desc") => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  actions,
  bulkActions,
  rowKey,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onRowClick,
  sortConfig,
  onSortChange,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  bordered = false,
}: DataTableProps<T> & { bordered?: boolean }) {
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    if (selectedKeys.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row) => row[rowKey] as string | number));
    }
  }, [data, rowKey, selectedKeys, onSelectionChange]);

  const handleSelectRow = useCallback(
    (key: string | number) => {
      if (!onSelectionChange) return;
      if (selectedKeys.includes(key)) {
        onSelectionChange(selectedKeys.filter((k) => k !== key));
      } else {
        onSelectionChange([...selectedKeys, key]);
      }
    },
    [selectedKeys, onSelectionChange]
  );

  const handleSort = useCallback(
    (key: string) => {
      if (!onSortChange) return;
      if (sortConfig?.key === key) {
        onSortChange(key, sortConfig.direction === "asc" ? "desc" : "asc");
      } else {
        onSortChange(key, "asc");
      }
    },
    [sortConfig, onSortChange]
  );

  const isAllSelected = data.length > 0 && selectedKeys.length === data.length;
  const isPartialSelected = selectedKeys.length > 0 && selectedKeys.length < data.length;
  const hasSelection = selectedKeys.length > 0;

  const getSelectedRows = useCallback(() => {
    return data.filter((row) => selectedKeys.includes(row[rowKey] as string | number));
  }, [data, selectedKeys, rowKey]);

  const bulkActionStyles = {
    default: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    danger: "text-red-600 hover:text-red-700 hover:bg-red-50",
    primary: "text-viking-600 hover:text-viking-700 hover:bg-viking-50",
  };

  return (
    <div className={`${bordered ? "border border-slate-200 rounded-lg" : ""} ${className}`}>
      {/* Bulk Actions Toolbar */}
      {hasSelection && bulkActions && bulkActions.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-viking-50/50 border-b border-viking-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-viking-700">
              {selectedKeys.length} selected
            </span>
            <button
              type="button"
              onClick={() => onSelectionChange?.([])}
              className="text-xs text-viking-600 hover:text-viking-800 hover:underline"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-1">
            {bulkActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={() => action.onClick(getSelectedRows())}
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${bulkActionStyles[action.variant || "default"]}
                `}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
            {selectable && (
              <th className="px-3 py-2 w-8">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartialSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-200 focus:ring-offset-0 cursor-pointer"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                className={`
                  px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider
                  text-${col.align || "left"}
                  ${col.sortable ? "cursor-pointer hover:text-slate-700 select-none" : ""}
                `}
              >
                <div className={`inline-flex items-center gap-1.5 ${col.align === "right" ? "flex-row-reverse" : ""}`}>
                  {col.header}
                  {col.sortable && (
                    <span className="w-3 h-3 flex items-center justify-center">
                      {sortConfig?.key === String(col.key) ? (
                        sortConfig.direction === "asc" ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        )
                      ) : (
                        <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-right w-auto">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-12">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-slate-500 mt-2">Loading...</p>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-900">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = row[rowKey] as string | number;
              const isSelected = selectedKeys.includes(key);

              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  className={`
                    group transition-colors duration-100
                    ${onRowClick ? "cursor-pointer hover:bg-slate-100/70" : ""}
                    ${isSelected ? "bg-viking-50" : ""}
                  `}
                >
                  {selectable && (
                    <td className="px-3 py-2 w-8" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-200 focus:ring-offset-0 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const value = typeof col.key === "string" && col.key.includes(".")
                      ? col.key.split(".").reduce((obj: unknown, key) => (obj as Record<string, unknown>)?.[key], row)
                      : row[col.key as keyof T];

                    return (
                      <td
                        key={String(col.key)}
                        className={`px-3 py-2 text-sm text-slate-700 text-${col.align || "left"}`}
                      >
                        {col.render ? col.render(value, row, index) : String(value ?? "")}
                      </td>
                    );
                  })}
                  {actions && actions.length > 0 && (
                    <td className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            type="button"
                            onClick={() => action.onClick(row, index)}
                            title={action.label}
                            className={`
                              p-1.5 rounded transition-all
                              ${action.hoverOnly ? "opacity-0 group-hover:opacity-100" : ""}
                              ${
                                action.variant === "danger"
                                  ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                              }
                            `}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
