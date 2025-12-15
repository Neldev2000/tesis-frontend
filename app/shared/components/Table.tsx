import type { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

function TableRoot({ children, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

function TableHeader({ children, className = "" }: TableHeaderProps) {
  return <thead className={className}>{children}</thead>;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

function TableBody({ children, className = "" }: TableBodyProps) {
  return <tbody className={`divide-y divide-gray-100 ${className}`}>{children}</tbody>;
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
        ${onClick ? "cursor-pointer hover:bg-gray-50" : ""}
        ${selected ? "bg-viking-50" : ""}
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
}

function TableHead({
  children,
  className = "",
  sortable,
  sortDirection,
  onSort,
}: TableHeadProps) {
  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={`
        px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
        ${sortable ? "cursor-pointer hover:text-midnight select-none" : ""}
        ${className}
      `}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="w-4 h-4 flex flex-col items-center justify-center">
            {sortDirection === "asc" && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8l-6 6h12l-6-6z" />
              </svg>
            )}
            {sortDirection === "desc" && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 16l6-6H6l6 6z" />
              </svg>
            )}
            {!sortDirection && (
              <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8l-4 4h8l-4-4zM12 16l4-4H8l4 4z" />
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
}

function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>
      {children}
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
            <div className="w-12 h-12 text-gray-300 mb-3">{icon}</div>
          ) : (
            <svg
              className="w-12 h-12 text-gray-300 mb-3"
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
          <p className="text-sm font-medium text-midnight">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </td>
    </tr>
  );
}

// Pagination component
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = [];
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
    <div
      className={`flex items-center justify-between px-4 py-3 border-t border-gray-100 ${className}`}
    >
      <span className="text-sm text-gray-500">
        Showing <span className="font-medium">{startItem}-{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> items
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 text-gray-500 hover:text-midnight hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                min-w-[32px] h-8 px-2 text-sm font-medium rounded transition-colors
                ${
                  currentPage === page
                    ? "bg-viking-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
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
          className="p-1.5 text-gray-500 hover:text-midnight hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
  Empty: TableEmpty,
  Pagination: TablePagination,
});
