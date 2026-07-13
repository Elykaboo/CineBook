import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SeatMap } from "./seat-map";

export default async function ShowtimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const showtime = await prisma.showtime.findUnique({
    where: { id },
    include: {
      movie: true,
      hall: {
        include: {
          seats: { orderBy: [{ row: "asc" }, { column: "asc" }] },
        },
      },
    },
  });

  if (!showtime) notFound();

  const bookedSeats = await prisma.bookingSeat.findMany({
    where: {
      showtimeId: id,
      booking: { status: { not: "CANCELLED" } },
    },
    select: { seatId: true },
  });
  const bookedSeatIds = new Set(bookedSeats.map((b) => b.seatId));

  const seats = showtime.hall.seats.map((seat) => ({
    id: seat.id,
    row: seat.row,
    column: seat.column,
    type: seat.type,
    taken: bookedSeatIds.has(seat.id),
  }));

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">{showtime.movie.title}</h1>
        <p className="text-sm text-gray-500">
          {showtime.hall.name} ·{" "}
          {showtime.startTime.toLocaleString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>

      <SeatMap
        showtimeId={showtime.id}
        seats={seats}
        price={showtime.price.toNumber()}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
