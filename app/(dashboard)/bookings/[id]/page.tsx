import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

  return (
    <div className="flex flex-col gap-4 p-8 max-w-lg">
      <h1 className="text-2xl font-semibold">Booking Confirmed</h1>

      <div className="border rounded p-4 flex flex-col gap-2">
        <p className="font-medium">{booking.showtime.movie.title}</p>
        <p className="text-sm text-gray-500">
          {booking.showtime.hall.name} ·{" "}
          {booking.showtime.startTime.toLocaleString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        <p className="text-sm">
          Seats:{" "}
          {booking.bookingSeats
            .map((bs) => `${bs.seat.row + 1}${String.fromCharCode(65 + bs.seat.column)}`)
            .join(", ")}
        </p>
        <p className="text-sm">Status: {booking.status}</p>
        <p className="font-medium">
          Total: ₱{booking.totalPrice.toNumber().toFixed(2)}
        </p>
      </div>
    </div>
  );
}
