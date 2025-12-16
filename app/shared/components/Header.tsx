// 2025 Design: STRUCTURED header - Linear/Vercel aesthetic
// - Dense, technical feel with slate palette
// - Search bar is a key interaction point
// - Subtle shadows and borders, not floating

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
      className="p-1.5 -ml-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100/70 rounded-md lg:hidden transition-colors"
      aria-label="Open menu"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
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
  placeholder = "Search...",
}: {
  onClick?: () => void;
  placeholder?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent", pointerEvents: "auto" }}
      className="flex items-center gap-2.5 flex-1 max-w-md px-3 py-1.5 text-[13px] text-slate-400 bg-white border border-slate-200/60 rounded-lg hover:border-slate-300/80 hover:bg-slate-100/50 transition-all text-left shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)]"
    >
      <svg
        className="h-4 w-4 flex-shrink-0 text-slate-400"
        style={{ pointerEvents: "none" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <span className="flex-1 truncate" style={{ pointerEvents: "none" }}>{placeholder}</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200/80 rounded shadow-[0_1px_2px_rgba(15,23,42,0.04)]" style={{ pointerEvents: "none" }}>
        <span className="text-[9px]">⌘</span>K
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
      className="relative p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 rounded-md transition-colors"
      aria-label="Notifications"
    >
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
      {count !== undefined && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

function QuickActions() {
  return (
    <div className="hidden md:flex items-center gap-1 border-l border-slate-200/60 pl-3 ml-2">
      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 rounded-md transition-colors" title="Help">
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      </button>
      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 rounded-md transition-colors" title="Settings">
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
    </div>
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
    <header className="bg-canvas border-b border-slate-200/60 px-4 py-2.5 lg:px-5 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <MenuButton onClick={onMenuClick} />
          <SearchButton onClick={onSearchClick} placeholder={searchPlaceholder} />
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell
            count={notificationCount}
            onClick={onNotificationsClick}
          />
          <QuickActions />
        </div>
      </div>
    </header>
  );
}
