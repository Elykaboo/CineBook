import { cn } from "@/lib/cn";

export type SeatState = "regular" | "premium" | "selected" | "taken";

const stateClasses: Record<SeatState, string> = {
  regular: "bg-seat-regular-bg border-seat-regular-border text-seat-regular-text",
  premium: "bg-seat-premium-bg border-seat-premium-border text-seat-premium-text",
  selected: "bg-seat-selected-bg border-seat-selected-border text-seat-selected-text",
  taken:
    "bg-seat-taken-bg border-seat-taken-border text-seat-taken-text cursor-not-allowed opacity-70",
};

export function SeatButton({
  label,
  state,
  onClick,
  className,
}: {
  label: string;
  state: SeatState;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={state === "taken"}
      onClick={onClick}
      className={cn(
        "flex h-6.5 w-7 items-center justify-center rounded-seat border font-mono text-[8.5px]",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]",
        stateClasses[state],
        className
      )}
    >
      {label}
    </button>
  );
}
