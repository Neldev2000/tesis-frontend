import type { ReactNode } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "busy" | "away";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]", status: "w-1.5 h-1.5 border" },
  sm: { container: "w-8 h-8", text: "text-xs", status: "w-2 h-2 border" },
  md: { container: "w-10 h-10", text: "text-sm", status: "w-2.5 h-2.5 border-2" },
  lg: { container: "w-12 h-12", text: "text-base", status: "w-3 h-3 border-2" },
  xl: { container: "w-16 h-16", text: "text-lg", status: "w-4 h-4 border-2" },
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const styles = sizeStyles[size];

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${styles.container} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${styles.container} rounded-full bg-viking-100 text-viking-700 flex items-center justify-center font-medium ${styles.text}`}
        >
          {initials || alt.charAt(0).toUpperCase()}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${styles.status} rounded-full border-white ${statusColors[status]}`}
        />
      )}
    </div>
  );
}

// Avatar group for showing multiple avatars stacked
interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  children,
  max,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleAvatars = max ? childArray.slice(0, max) : childArray;
  const remainingCount = max ? Math.max(0, childArray.length - max) : 0;

  const styles = sizeStyles[size];

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`${styles.container} rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium ${styles.text} ring-2 ring-white`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

// User avatar with name and subtitle
interface UserAvatarProps {
  src?: string;
  name: string;
  subtitle?: string;
  initials?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

export function UserAvatar({
  src,
  name,
  subtitle,
  initials,
  size = "md",
  status,
  className = "",
}: UserAvatarProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar
        src={src}
        alt={name}
        initials={initials || name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        size={size}
        status={status}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-midnight truncate">{name}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
