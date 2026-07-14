import { cn } from "@/lib/cn";
import type { BookingStatus } from "@prisma/client";

const statusClasses: Record<BookingStatus, string> = {
  CONFIRMED: "bg-status-confirmed-bg text-status-confirmed-text",
  PENDING: "bg-status-pending-bg text-status-pending-text",
  CANCELLED: "bg-status-cancelled-bg text-status-cancelled-text",
};

const dotClasses: Record<BookingStatus, string> = {
  CONFIRMED: "bg-status-confirmed-dot",
  PENDING: "bg-status-pending-dot",
  CANCELLED: "bg-status-cancelled-dot",
};

export function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 font-mono text-2xs font-medium uppercase tracking-wider",
        statusClasses[status]
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          dotClasses[status],
          status === "PENDING" && "status-dot-pulse"
        )}
      />
      {status}
    </span>
  );
}
