import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-surface-brand text-fg-inverse hover:bg-teal-600 disabled:bg-teal-300",
  secondary:
    "bg-surface-1 text-fg-1 border border-border-2 hover:bg-surface-3 disabled:text-fg-4 disabled:border-border-1",
  ghost: "bg-transparent text-fg-2 hover:bg-surface-3 disabled:text-fg-4",
  danger: "bg-transparent text-red-600 hover:bg-red-50 disabled:text-fg-4",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-[28px] px-3 text-xs gap-1.5",
  md: "h-[34px] px-4 text-sm gap-2",
  lg: "h-[40px] px-5 text-base gap-2",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-button font-medium",
    "transition-[background-color,transform] duration-150 active:scale-[0.982]",
    "focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]",
    "disabled:cursor-not-allowed disabled:active:scale-100",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
});
