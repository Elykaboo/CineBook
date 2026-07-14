import { type SelectHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
  }
>(function Select({ className, label, error, id, children, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-fg-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        className={cn(
          "h-[34px] rounded-input border bg-surface-1 px-3 text-sm text-fg-1",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]",
          error ? "border-border-error" : "border-border-1",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
