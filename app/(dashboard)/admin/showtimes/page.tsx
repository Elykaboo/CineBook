import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createShowtime, deleteShowtime } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { ShowtimeForm } from "./showtime-form";

export default async function AdminShowtimesPage() {
  const [showtimes, movies, halls] = await Promise.all([
    prisma.showtime.findMany({
      orderBy: { startTime: "asc" },
      include: { movie: true, hall: true },
    }),
    prisma.movie.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    prisma.cinemaHall.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <h1 className="font-serif text-2xl text-fg-1">Showtimes</h1>

        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-1 text-left text-xs text-fg-3">
                <th className="px-4 py-3 font-medium">Movie</th>
                <th className="px-4 py-3 font-medium">Hall</th>
                <th className="px-4 py-3 font-medium">Date/time</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {showtimes.map((showtime) => (
                <tr
                  key={showtime.id}
                  className="border-b border-border-1 last:border-0"
                >
                  <td className="px-4 py-3 font-semibold text-fg-1">
                    {showtime.movie.title}
                  </td>
                  <td className="px-4 py-3 text-fg-2">{showtime.hall.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-2">
                    {showtime.startTime.toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-fg-2">
                    ₱{showtime.price.toNumber().toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/showtimes/${showtime.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-chip text-fg-2 hover:bg-surface-3 hover:text-fg-1"
                        aria-label={`Edit showtime for ${showtime.movie.title}`}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <form action={deleteShowtime}>
                        <input
                          type="hidden"
                          name="showtimeId"
                          value={showtime.id}
                        />
                        <button
                          type="submit"
                          className="flex h-8 w-8 items-center justify-center rounded-chip text-fg-2 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete showtime for ${showtime.movie.title}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="h-fit w-full p-5 lg:w-96">
        <h2 className="mb-4 font-semibold text-fg-1">New showtime</h2>
        <ShowtimeForm movies={movies} halls={halls} action={createShowtime} />
      </Card>
    </div>
  );
}
