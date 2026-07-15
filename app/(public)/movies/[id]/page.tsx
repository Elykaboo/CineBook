import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PosterTile } from "@/components/ui/poster-tile";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-8 p-8 md:flex-row">
      <div className="w-full shrink-0 md:w-55">
        <PosterTile
          title={movie.title}
          genre={movie.genre}
          rating={movie.rating}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl text-fg-1">{movie.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">{movie.genre}</Badge>
            <Badge variant="neutral">{movie.durationMinutes} min</Badge>
            <Badge variant="neutral">{movie.rating}</Badge>
          </div>
        </div>

        <p className="max-w-[60ch] text-sm leading-relaxed text-fg-2">
          {movie.description}
        </p>

        <div>
          <h2 className="mb-2 font-semibold text-fg-1">Showtimes</h2>
          {showtimesByDate.size === 0 ? (
            <p className="text-sm text-fg-2">
              No upcoming showtimes scheduled.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {[...showtimesByDate.entries()].map(([date, showtimes]) => (
                <div key={date}>
                  <h3 className="mb-1.5 font-mono text-xs uppercase tracking-wide text-fg-3">
                    {date}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {showtimes.map((showtime) => (
                      <Link
                        key={showtime.id}
                        href={`/showtimes/${showtime.id}`}
                        className="rounded-button border border-border-1 px-3 py-2 text-sm font-semibold text-fg-1 transition-colors duration-150 hover:border-teal-500 hover:bg-surface-brand-subtle"
                      >
                        {showtime.startTime.toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        <span className="font-normal text-fg-2">
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
