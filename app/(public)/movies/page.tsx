import Link from "next/link";
import { Film } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { MovieStatus } from "@prisma/client";
import { PosterTile } from "@/components/ui/poster-tile";

const TABS: { label: string; value: MovieStatus }[] = [
  { label: "Now showing", value: "NOW_SHOWING" },
  { label: "Coming soon", value: "COMING_SOON" },
];

function isMovieStatus(value: string | undefined): value is MovieStatus {
  return value === "NOW_SHOWING" || value === "COMING_SOON";
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status: MovieStatus = isMovieStatus(rawStatus)
    ? rawStatus
    : "NOW_SHOWING";

  const movies = await prisma.movie.findMany({
    where: { status },
    orderBy: { title: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="font-serif text-3xl text-fg-1">What&apos;s on</h1>

      <div className="inline-flex w-fit gap-1 rounded-pill bg-surface-3 p-1">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/movies?status=${tab.value}`}
            className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
              status === tab.value
                ? "bg-surface-1 text-fg-1 shadow-card-hover"
                : "text-fg-2 hover:text-fg-1"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-avatar bg-surface-3">
            <Film className="h-6 w-6 text-fg-3" strokeWidth={1.75} />
          </span>
          <p className="font-medium text-fg-1">
            No movies in this category yet
          </p>
          <p className="text-sm text-fg-2">
            Check back soon — new titles are added every week.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="flex flex-col gap-2"
            >
              <PosterTile
                title={movie.title}
                genre={movie.genre}
                rating={movie.rating}
              />
              <div>
                <h2 className="text-sm font-semibold leading-tight text-fg-1">
                  {movie.title}
                </h2>
                <p className="font-mono text-xs text-fg-2">
                  {movie.genre} · {movie.durationMinutes} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
