import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function groupByDate<T extends { startTime: Date }>(items: T[]) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.startTime.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }
  return groups;
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      showtimes: {
        where: { startTime: { gte: new Date() } },
        orderBy: { startTime: "asc" },
        include: { hall: true },
      },
    },
  });

  if (!movie) notFound();

  const showtimesByDate = groupByDate(movie.showtimes);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="relative aspect-2/3 w-full max-w-xs shrink-0 overflow-hidden rounded bg-gray-100">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{movie.title}</h1>
          <p className="text-sm text-gray-500">
            {movie.genre} · {movie.durationMinutes} min · {movie.rating}
          </p>
        </div>

        <p className="max-w-2xl">{movie.description}</p>

        <div>
          <h2 className="font-medium mb-2">Showtimes</h2>
          {showtimesByDate.size === 0 ? (
            <p className="text-gray-500 text-sm">
              No upcoming showtimes scheduled.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {[...showtimesByDate.entries()].map(([date, showtimes]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {date}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {showtimes.map((showtime) => (
                      <Link
                        key={showtime.id}
                        href={`/showtimes/${showtime.id}`}
                        className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        {showtime.startTime.toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        <span className="text-gray-500">
                          {" "}
                          · {showtime.hall.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
