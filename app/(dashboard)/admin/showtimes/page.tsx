import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteShowtime } from "@/actions/admin";

export default async function AdminShowtimesPage() {
  const showtimes = await prisma.showtime.findMany({
    orderBy: { startTime: "asc" },
    include: { movie: true, hall: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Showtimes</h1>
        <Link
          href="/admin/showtimes/new"
          className="bg-black text-white rounded px-4 py-2 text-sm"
        >
          New Showtime
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {showtimes.map((showtime) => (
          <div
            key={showtime.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{showtime.movie.title}</p>
              <p className="text-sm text-gray-500">
                {showtime.hall.name} ·{" "}
                {showtime.startTime.toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                · ₱{showtime.price.toNumber().toFixed(2)}
              </p>
            </div>
            <form action={deleteShowtime}>
              <input type="hidden" name="showtimeId" value={showtime.id} />
              <button type="submit" className="text-red-600 underline text-sm">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
