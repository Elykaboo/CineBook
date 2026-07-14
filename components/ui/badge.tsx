import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "neutral" | "teal" | "amber" | "red" | "violet" | "blue";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-surface-3 text-fg-2",
  teal: "bg-surface-brand-subtle text-teal-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-600",
  violet: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-5 px-2 text-2xs",
  md: "h-6 px-2.5 text-xs",
};

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant; size?: Size }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge font-medium tracking-wide",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
