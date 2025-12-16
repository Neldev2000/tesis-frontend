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
      className="bg-white rounded-lg border border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden"
    >
      <div className="py-1">
        {hospitals.map((hospital) => (
          <button
            key={hospital.id}
            onClick={() => handleSwitch(hospital.id)}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors"
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                hospital.id === currentTenantId
                  ? "bg-viking-600"
                  : "bg-slate-200"
              }`}
            >
              <svg
                className={`w-3 h-3 ${hospital.id === currentTenantId ? "text-white" : "text-slate-500"}`}
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
              className={`text-[13px] truncate ${
                hospital.id === currentTenantId
                  ? "font-medium text-viking-700"
                  : "text-slate-700"
              }`}
            >
              {hospital.name}
            </span>
            {hospital.id === currentTenantId && (
              <svg
                className="w-3.5 h-3.5 text-viking-600 ml-auto"
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
      <div className="border-t border-slate-100 p-1.5">
        <NavLink
          to="/hospitals"
          onClick={() => {
            setIsOpen(false);
            onNavigate?.();
          }}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[13px] text-slate-600 hover:text-viking-600 hover:bg-slate-50 rounded-md transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
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
        className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-slate-50 rounded-md transition-colors"
      >
        <div className="w-7 h-7 rounded-md bg-viking-600 flex items-center justify-center flex-shrink-0" style={{ pointerEvents: "none" }}>
          <svg
            className="w-3.5 h-3.5 text-white"
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
          <p className="text-[13px] font-semibold text-slate-900 truncate">
            {currentTenantName}
          </p>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        `relative flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
          isActive
            ? "text-slate-900 bg-slate-100/70"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-viking-600" : "text-slate-400"}`}>
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
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
    <div className="border-t border-slate-200/60 px-3 py-2 space-y-0.5">
   

      <button
        onClick={onProfileClick}
        className="flex items-center gap-2.5 px-2.5 py-1.5 w-full rounded-md hover:bg-slate-50 transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-md object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-md bg-viking-100 text-viking-700 flex items-center justify-center font-medium text-[10px]">
            {user.initials}
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[13px] font-medium text-slate-900 truncate">
            {user.name}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{user.role}</p>
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

      {/* Sidebar - STRUCTURED with solid border (not floating) */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-60 bg-canvas
          border-r border-slate-200
          flex flex-col transition-transform duration-200 ease-out
          lg:z-30
          ${isOpen ? "sidebar-transform-visible" : "sidebar-transform-hidden"}
        `}
      >
        <div className="flex items-center gap-1 px-3 py-3 border-b border-slate-200/60">
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
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md lg:hidden flex-shrink-0"
            aria-label="Close menu"
          >
            <svg
              className="w-4 h-4"
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

        <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar-subtle">
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
