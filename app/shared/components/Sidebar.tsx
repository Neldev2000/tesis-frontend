import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router";
import type { NavItem, UserProfile, Hospital } from "../types/navigation";

interface SidebarProps {
  user: UserProfile;
  navItems: NavItem[];
  tenantId: string;
  tenantName?: string;
  hospitals?: Hospital[];
  isOpen?: boolean;
  onClose?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

function TenantSwitcher({
  currentTenantId,
  currentTenantName,
  hospitals,
  onNavigate,
}: {
  currentTenantId: string;
  currentTenantName: string;
  hospitals: Hospital[];
  onNavigate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  // Update popover position when open
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = (hospitalId: string) => {
    setIsOpen(false);
    navigate(`/${hospitalId}`);
    onNavigate?.();
  };

  const popoverContent = isOpen ? (
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: popoverStyle.top,
        left: popoverStyle.left,
        width: popoverStyle.width,
        zIndex: 99999,
      }}
      className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
    >
      <div className="py-1">
        {hospitals.map((hospital) => (
          <button
            key={hospital.id}
            onClick={() => handleSwitch(hospital.id)}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                hospital.id === currentTenantId
                  ? "bg-viking-500"
                  : "bg-gray-200"
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 ${hospital.id === currentTenantId ? "text-white" : "text-gray-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                />
              </svg>
            </div>
            <span
              className={`text-sm truncate ${
                hospital.id === currentTenantId
                  ? "font-medium text-viking-700"
                  : "text-gray-700"
              }`}
            >
              {hospital.name}
            </span>
            {hospital.id === currentTenantId && (
              <svg
                className="w-4 h-4 text-viking-500 ml-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-gray-100 p-2">
        <NavLink
          to="/hospitals"
          onClick={() => {
            setIsOpen(false);
            onNavigate?.();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-viking-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          View all hospitals
        </NavLink>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        type="button"
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent", pointerEvents: "auto" }}
        className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-viking-500 flex items-center justify-center flex-shrink-0" style={{ pointerEvents: "none" }}>
          <svg
            className="w-4 h-4 text-white"
            style={{ pointerEvents: "none" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0 text-left" style={{ pointerEvents: "none" }}>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {currentTenantName}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ pointerEvents: "none" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {popoverContent && createPortal(popoverContent, document.body)}
    </div>
  );
}

function NavItemLink({
  item,
  tenantId,
  onClick,
}: {
  item: NavItem;
  tenantId: string;
  onClick?: () => void;
}) {
  const href = item.href === "" ? `/${tenantId}` : `/${tenantId}/${item.href}`;

  return (
    <NavLink
      to={href}
      end={item.href === ""}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "text-gray-900"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Subtle left indicator for active state */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-viking-500 rounded-full" />
          )}
          <span className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-viking-600" : ""}`}>
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function UserSection({
  user,
  onSettingsClick,
  onProfileClick,
}: {
  user: UserProfile;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}) {
  return (
    <div className="border-t border-gray-100/60 p-3 space-y-1">
      <button
        onClick={onSettingsClick}
        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg w-full transition-colors"
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
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span>Settings</span>
      </button>

      <button
        onClick={onProfileClick}
        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-50 transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-viking-100 text-viking-700 flex items-center justify-center font-medium text-xs">
            {user.initials}
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.role}</p>
        </div>
      </button>
    </div>
  );
}

export function Sidebar({
  user,
  navItems,
  tenantId,
  tenantName,
  hospitals = [],
  isOpen = false,
  onClose,
  onSettingsClick,
  onProfileClick,
}: SidebarProps) {
  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="bg-gray-900/60 lg:hidden animate-in fade-in duration-200"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            WebkitBackdropFilter: "blur(4px)",
            backdropFilter: "blur(4px)",
          }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64 bg-white
          shadow-[1px_0_0_rgba(0,0,0,0.04)]
          flex flex-col transition-transform duration-300 ease-in-out
          lg:z-30
          ${isOpen ? "sidebar-transform-visible" : "sidebar-transform-hidden"}
        `}
      >
        <div className="flex items-center gap-1 p-2 border-b border-gray-100/60">
          <div className="flex-1 min-w-0">
            <TenantSwitcher
              currentTenantId={tenantId}
              currentTenantName={tenantName ?? tenantId}
              hospitals={hospitals}
              onNavigate={handleNavClick}
            />
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden flex-shrink-0"
            aria-label="Close menu"
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavItemLink
                  item={item}
                  tenantId={tenantId}
                  onClick={handleNavClick}
                />
              </li>
            ))}
          </ul>
        </nav>

        <UserSection
          user={user}
          onSettingsClick={onSettingsClick}
          onProfileClick={onProfileClick}
        />
      </aside>
    </>
  );
}
