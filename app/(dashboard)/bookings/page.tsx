import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cancelBooking } from "@/actions/bookings";

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
      <h1 className="text-2xl font-semibold">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t booked any tickets yet.{" "}
          <Link href="/movies" className="underline">
            Browse movies
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => {
            const isCancellable =
              booking.status !== "CANCELLED" &&
              booking.showtime.startTime > new Date();

            return (
              <div
                key={booking.id}
                className="border rounded p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="font-medium underline"
                    >
                      {booking.showtime.movie.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {booking.showtime.hall.name} ·{" "}
                      {booking.showtime.startTime.toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm">
                      Seats:{" "}
                      {booking.bookingSeats
                        .map(
                          (bs) =>
                            `${bs.seat.row + 1}${String.fromCharCode(
                              65 + bs.seat.column
                            )}`
                        )
                        .join(", ")}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      booking.status === "CANCELLED"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    ₱{booking.totalPrice.toNumber().toFixed(2)}
                  </p>

                  {isCancellable && (
                    <form action={cancelBooking}>
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <button
                        type="submit"
                        className="text-sm text-red-600 underline"
                      >
                        Cancel booking
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
