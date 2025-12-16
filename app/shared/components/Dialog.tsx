import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

interface DialogContextValue {
  onClose: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: DialogSize;
  /** Prevent closing when clicking backdrop */
  persistent?: boolean;
  /** Custom class for the dialog panel */
  className?: string;
}

function DialogRoot({
  open,
  onClose,
  children,
  size = "md",
  persistent = false,
  className = "",
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !persistent) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, persistent]);

  // Lock body scroll when open
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

  // Focus trap
  useEffect(() => {
    if (!open || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    dialog.addEventListener("keydown", handleTabKey);
    return () => dialog.removeEventListener("keydown", handleTabKey);
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (!persistent) {
      onClose();
    }
  };

  return createPortal(
    <DialogContext.Provider value={{ onClose }}>
      <div
        className="flex items-end sm:items-center justify-center sm:p-4"
        role="dialog"
        aria-modal="true"
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
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Dialog panel - drawer on mobile, modal on sm+ */}
        <div
          ref={dialogRef}
          className={`
            w-full bg-white shadow-xl flex flex-col
            max-h-[85vh] sm:max-h-[90vh]
            rounded-t-2xl sm:rounded-xl
            animate-in fade-in dialog-panel duration-200
            sm:${sizeClasses[size]}
            ${className}
          `}
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Drag handle - visible only on mobile */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          {children}
        </div>
      </div>
    </DialogContext.Provider>,
    document.body
  );
}

interface DialogHeaderProps {
  children: ReactNode;
  /** Show close button */
  showClose?: boolean;
  className?: string;
}

function DialogHeader({
  children,
  showClose = true,
  className = "",
}: DialogHeaderProps) {
  const { onClose } = useDialogContext();

  return (
    <div
      className={`flex-shrink-0 flex items-start justify-between gap-4 px-4 sm:px-6 pt-2 sm:pt-6 pb-4 ${className}`}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {showClose && (
        <button
          onClick={onClose}
          className="p-1.5 -m-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Close dialog"
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
      )}
    </div>
  );
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

function DialogDescription({
  children,
  className = "",
}: DialogDescriptionProps) {
  return (
    <p className={`mt-1 text-sm text-gray-500 ${className}`}>{children}</p>
  );
}

interface DialogBodyProps {
  children: ReactNode;
  className?: string;
}

function DialogBody({ children, className = "" }: DialogBodyProps) {
  return (
    <div className={`flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-2 custom-scrollbar ${className}`}>
      {children}
    </div>
  );
}

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

function DialogFooter({ children, className = "" }: DialogFooterProps) {
  return (
    <div
      className={`flex-shrink-0 flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

// Button components for consistent dialog actions
interface DialogButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

function DialogButton({
  children,
  onClick,
  variant = "secondary",
  disabled = false,
  type = "button",
  className = "",
}: DialogButtonProps) {
  const variants = {
    primary:
      "bg-viking-500 text-white hover:bg-viking-600 focus:ring-viking-500/20",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500/20",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 text-sm font-medium rounded-lg transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Export as compound component
export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Button: DialogButton,
});
