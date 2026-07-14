import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  interactive,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-1 bg-surface-1 shadow-card",
        interactive &&
          "transition-shadow duration-150 hover:shadow-card-hover",
        className
      )}
      {...props}
    />
  );
}
