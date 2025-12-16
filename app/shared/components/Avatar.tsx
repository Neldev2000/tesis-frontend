import type { ReactNode } from "react";

// 2025 Design: Clean, professional avatar styles
// - Muted color palette for initials
// - Subtle status indicators
// - Better contrast and accessibility

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "busy" | "away";
type AvatarColor = "gray" | "blue" | "green" | "amber" | "red" | "violet";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  color?: AvatarColor;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string; statusRing: string }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]", status: "w-1.5 h-1.5", statusRing: "ring-1" },
  sm: { container: "w-8 h-8", text: "text-xs", status: "w-2 h-2", statusRing: "ring-[1.5px]" },
  md: { container: "w-10 h-10", text: "text-sm", status: "w-2.5 h-2.5", statusRing: "ring-2" },
  lg: { container: "w-12 h-12", text: "text-base", status: "w-3 h-3", statusRing: "ring-2" },
  xl: { container: "w-16 h-16", text: "text-lg", status: "w-3.5 h-3.5", statusRing: "ring-2" },
};

// Muted status colors - subtle, not flashy
const statusColors: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-slate-300",
  busy: "bg-red-400",
  away: "bg-amber-400",
};

// Muted avatar background colors - using slate-based palette for professional look
const avatarColors: Record<AvatarColor, string> = {
  gray: "bg-slate-100 text-slate-600",
  blue: "bg-slate-100 text-slate-600",
  green: "bg-slate-100 text-slate-600",
  amber: "bg-slate-100 text-slate-600",
  red: "bg-slate-100 text-slate-600",
  violet: "bg-slate-100 text-slate-600",
};

// Generate consistent color from name
function getColorFromName(name: string): AvatarColor {
  const colors: AvatarColor[] = ["gray", "blue", "green", "amber", "violet"];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
}

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  status,
  color,
  className = "",
}: AvatarProps) {
  const styles = sizeStyles[size];
  const avatarColor = color || getColorFromName(initials || alt);

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
          className={`${styles.container} rounded-full flex items-center justify-center font-medium ${styles.text} ${avatarColors[avatarColor]}`}
        >
          {initials || alt.charAt(0).toUpperCase()}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${styles.status} rounded-full ring-white ${styles.statusRing} ${statusColors[status]}`}
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
          className={`${styles.container} rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-medium ${styles.text} ring-2 ring-white`}
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
  color?: AvatarColor;
  className?: string;
}

export function UserAvatar({
  src,
  name,
  subtitle,
  initials,
  size = "md",
  status,
  color,
  className = "",
}: UserAvatarProps) {
  const gapStyles: Record<AvatarSize, string> = {
    xs: "gap-2",
    sm: "gap-2.5",
    md: "gap-3",
    lg: "gap-3",
    xl: "gap-4",
  };

  return (
    <div className={`flex items-center ${gapStyles[size]} ${className}`}>
      <Avatar
        src={src}
        alt={name}
        initials={initials || name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        size={size}
        status={status}
        color={color}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
