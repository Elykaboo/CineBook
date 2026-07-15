import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cancelBooking } from "@/actions/bookings";
import { seatLabel } from "@/lib/seat-label";
import { Card } from "@/components/ui/card";
import { PosterChip } from "@/components/ui/poster-tile";
import { StatusPill } from "@/components/ui/status-pill";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/bookings/${id}`);

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      showtime: { include: { movie: true, hall: true } },
      bookingSeats: { include: { seat: true } },
    },
  });

  if (!booking || booking.userId !== session.user.id) notFound();

  const isCancellable =
    booking.status !== "CANCELLED" && booking.showtime.startTime > new Date();

  const seats = booking.bookingSeats
    .map((bs) => seatLabel(bs.seat.row, bs.seat.column))
    .join(", ");

  const confirmationCode = `CB-${booking.id.slice(-8).toUpperCase()}`;

  return (
    <div className="mx-auto flex w-full max-w-120 flex-col items-center gap-4 p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-avatar bg-surface-brand-subtle">
        <Check className="h-6 w-6 text-teal-600" strokeWidth={1.75} />
      </span>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-serif text-2xl text-fg-1">You&apos;re booked</h1>
        <p className="text-sm text-fg-2">
          A confirmation has been sent to {session.user.email}.
        </p>
      </div>

      <Card className="w-full rounded-modal p-0">
        <div className="flex items-center gap-3 p-5">
          <PosterChip title={booking.showtime.movie.title} />
          <div className="flex-1">
            <p className="font-semibold text-fg-1">
              {booking.showtime.movie.title}
            </p>
          </div>
          <StatusPill status={booking.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 px-5 pb-5">
          <Field label="Hall" value={booking.showtime.hall.name} />
          <Field
            label="Showtime"
            value={booking.showtime.startTime.toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          />
          <Field label="Seats" value={seats} mono />
          <Field
            label="Total paid"
            value={`₱${booking.totalPrice.toNumber().toFixed(2)}`}
          />
        </div>

        <div className="border-t border-dashed border-border-2" />

        <div className="flex flex-col items-center gap-2 p-5">
          <p className="font-mono text-xs tracking-widest text-fg-2">
            {confirmationCode}
          </p>
          <div
            className="h-8 w-full rounded-chip"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-fg-1) 0px, var(--color-fg-1) 2px, transparent 2px, transparent 4px, var(--color-fg-1) 4px, var(--color-fg-1) 5px, transparent 5px, transparent 9px, var(--color-fg-1) 9px, var(--color-fg-1) 11px, transparent 11px, transparent 13px)",
            }}
          />
        </div>
      </Card>

      <div className="flex w-full gap-3">
        <Link href="/movies" className={buttonVariants({ variant: "secondary", className: "flex-1" })}>
          Browse more movies
        </Link>
        {isCancellable && (
          <form action={cancelBooking} className="flex-1">
            <input type="hidden" name="bookingId" value={booking.id} />
            <Button type="submit" variant="danger" className="w-full">
              Cancel booking
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-fg-3">{label}</span>
      <span
        className={mono ? "font-mono text-sm text-fg-1" : "text-sm text-fg-1"}
      >
        {value}
      </span>
    </div>
  );
}
