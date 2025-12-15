interface HeaderProps {
  notificationCount?: number;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
  searchPlaceholder?: string;
}

function MenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 -ml-2 text-gray-500 hover:text-midnight hover:bg-gray-100 rounded-lg lg:hidden"
      aria-label="Open menu"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );
}

function SearchButton({
  onClick,
  placeholder = "Search patients, doctors, or records...",
}: {
  onClick?: () => void;
  placeholder?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 flex-1 max-w-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-100/50 transition-colors text-left"
    >
      <svg
        className="h-5 w-5 flex-shrink-0"
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
      <span className="flex-1 truncate">{placeholder}</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-400 bg-white border border-gray-200 rounded">
        <span className="text-[10px]">⌘</span>K
      </kbd>
    </button>
  );
}

function NotificationBell({
  count,
  onClick,
}: {
  count?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-500 hover:text-midnight hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Notifications"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
      {count !== undefined && count > 0 && (
        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

export function Header({
  notificationCount,
  onSearchClick,
  onNotificationsClick,
  onMenuClick,
  searchPlaceholder,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between gap-3 lg:gap-4">
        <div className="flex items-center gap-3 flex-1">
          <MenuButton onClick={onMenuClick} />
          <SearchButton onClick={onSearchClick} placeholder={searchPlaceholder} />
        </div>
        <NotificationBell
          count={notificationCount}
          onClick={onNotificationsClick}
        />
      </div>
    </header>
  );
}
