import { type TextareaHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    helperText?: string;
  }
>(function Textarea(
  { className, label, error, helperText, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-fg-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "rounded-input border bg-surface-1 px-3 py-2 text-sm text-fg-1",
          "placeholder:text-fg-3 transition-colors duration-150",
          "focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]",
          error ? "border-border-error" : "border-border-1",
          className
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : (
        helperText && <p className="text-xs text-fg-3">{helperText}</p>
      )}
    </div>
  );
});
