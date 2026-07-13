import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "@prisma/client";

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
      bookingSeats: true,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Bookings</h1>

      <div className="flex gap-2 border-b">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "ALL"
                ? "/admin/bookings"
                : `/admin/bookings?status=${filter.value}`
            }
            className={`px-3 py-2 text-sm border-b-2 ${
              (status ?? "ALL") === filter.value
                ? "border-black font-medium"
                : "border-transparent text-gray-500"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings in this category.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{booking.showtime.movie.title}</p>
                  <p className="text-sm text-gray-500">
                    {booking.user.name} ({booking.user.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.showtime.hall.name} ·{" "}
                    {booking.showtime.startTime.toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    · {booking.bookingSeats.length} seat
                    {booking.bookingSeats.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      booking.status === "CANCELLED"
                        ? "bg-gray-100 text-gray-500"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <p className="text-sm font-medium mt-1">
                    ₱{booking.totalPrice.toNumber().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
