import Link from "next/link";
import { redirect } from "next/navigation";
import { Ticket } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cancelBooking } from "@/actions/bookings";
import { seatLabel } from "@/lib/seat-label";
import { Card } from "@/components/ui/card";
import { PosterChip } from "@/components/ui/poster-tile";
import { StatusPill } from "@/components/ui/status-pill";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/bookings");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      showtime: { include: { movie: true, hall: true } },
      bookingSeats: { include: { seat: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="font-serif text-3xl text-fg-1">My bookings</h1>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-avatar bg-surface-3">
            <Ticket className="h-6 w-6 text-fg-3" strokeWidth={1.75} />
          </span>
          <p className="font-medium text-fg-1">
            You haven&apos;t booked any tickets yet
          </p>
          <p className="text-sm text-fg-2">
            When you book a showtime, it&apos;ll show up here.
          </p>
          <Link href="/movies" className={buttonVariants({ className: "mt-2" })}>
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => {
            const isCancellable =
              booking.status !== "CANCELLED" &&
              booking.showtime.startTime > new Date();
            const seats = booking.bookingSeats
              .map((bs) => seatLabel(bs.seat.row, bs.seat.column))
              .join(", ");

            return (
              <Card key={booking.id} className="flex items-center gap-4 p-4">
                <PosterChip title={booking.showtime.movie.title} />

                <div className="flex-1">
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="font-semibold text-fg-1 hover:underline"
                  >
                    {booking.showtime.movie.title}
                  </Link>
                  <p className="font-mono text-xs text-fg-2">
                    {booking.showtime.hall.name} ·{" "}
                    {booking.showtime.startTime.toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-fg-2">Seats {seats}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <StatusPill status={booking.status} />
                  <p className="font-serif text-lg text-fg-1">
                    ₱{booking.totalPrice.toNumber().toFixed(2)}
                  </p>
                  {isCancellable && (
                    <form action={cancelBooking}>
                      <input
                        type="hidden"
                        name="bookingId"
                        value={booking.id}
                      />
                      <Button type="submit" variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
