import { cn } from "@/lib/cn";

type Variant = "auto" | "teal" | "amber" | "blue" | "violet" | "red";
type Size = "sm" | "md" | "lg";

const palette: Record<Exclude<Variant, "auto">, string> = {
  teal: "bg-surface-brand-subtle text-teal-700",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-600",
  red: "bg-red-50 text-red-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-6 w-6 text-2xs",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

function colorForName(name: string): Exclude<Variant, "auto"> {
  const colors = Object.keys(palette) as Exclude<Variant, "auto">[];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  variant = "auto",
  size = "md",
  className,
}: {
  name: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const color = variant === "auto" ? colorForName(name) : variant;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-avatar font-medium",
        palette[color],
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
