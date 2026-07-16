import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/cn";
import { seatLabel } from "@/lib/seat-label";

const STATUS_FILTERS: { label: string; value: BookingStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function isBookingStatus(value: string | undefined): value is BookingStatus {
  return value === "PENDING" || value === "CONFIRMED" || value === "CANCELLED";
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status = isBookingStatus(rawStatus) ? rawStatus : undefined;

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      showtime: { include: { movie: true, hall: true } },
      bookingSeats: { include: { seat: true } },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl text-fg-1">Bookings</h1>

      <div className="flex gap-1 rounded-pill border border-border-1 bg-surface-1 p-1 w-fit">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "ALL"
                ? "/admin/bookings"
                : `/admin/bookings?status=${filter.value}`
            }
            className={cn(
              "rounded-pill px-3 py-1.5 text-sm font-medium transition-colors",
              (status ?? "ALL") === filter.value
                ? "bg-surface-brand text-fg-inverse"
                : "text-fg-3 hover:text-fg-1"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        {bookings.length === 0 ? (
          <p className="p-6 text-sm text-fg-3">No bookings in this category.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-1 text-left text-xs text-fg-3">
                <th className="px-4 py-3 font-medium">Movie</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Hall / time</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border-1 last:border-0">
                  <td className="px-4 py-3 font-semibold text-fg-1">
                    {booking.showtime.movie.title}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-fg-1">{booking.user.name}</p>
                    <p className="font-mono text-2xs text-fg-3">{booking.user.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-2">
                    {booking.showtime.hall.name} ·{" "}
                    {booking.showtime.startTime.toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-2">
                    {booking.bookingSeats
                      .map((bs) => seatLabel(bs.seat.row, bs.seat.column))
                      .join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={booking.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-fg-1">
                    ₱{booking.totalPrice.toNumber().toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
