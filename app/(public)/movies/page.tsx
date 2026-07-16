import Link from "next/link";
import { Film } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { MovieStatus, Prisma } from "@prisma/client";
import { PosterTile } from "@/components/ui/poster-tile";
import { MovieFilters } from "./movie-filters";

const TABS: { label: string; value: MovieStatus }[] = [
  { label: "Now showing", value: "NOW_SHOWING" },
  { label: "Coming soon", value: "COMING_SOON" },
];

const SORTS = [
  { label: "Title (A–Z)", value: "title-asc" },
  { label: "Shortest first", value: "duration-asc" },
  { label: "Longest first", value: "duration-desc" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

function isMovieStatus(value: string | undefined): value is MovieStatus {
  return value === "NOW_SHOWING" || value === "COMING_SOON";
}

function isSortValue(value: string | undefined): value is SortValue {
  return SORTS.some((s) => s.value === value);
}

function sortOrderBy(sort: SortValue): Prisma.MovieOrderByWithRelationInput {
  switch (sort) {
    case "duration-asc":
      return { durationMinutes: "asc" };
    case "duration-desc":
      return { durationMinutes: "desc" };
    default:
      return { title: "asc" };
  }
}

function buildQuery(overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(overrides)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/movies?${qs}` : "/movies";
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    q?: string;
    genre?: string;
    sort?: string;
  }>;
}) {
  const { status: rawStatus, q, genre: rawGenre, sort: rawSort } =
    await searchParams;
  const status: MovieStatus = isMovieStatus(rawStatus)
    ? rawStatus
    : "NOW_SHOWING";
  const genre = rawGenre && rawGenre !== "ALL" ? rawGenre : undefined;
  const sort: SortValue = isSortValue(rawSort) ? rawSort : "title-asc";
  const search = q?.trim();

  const [movies, genreRows] = await Promise.all([
    prisma.movie.findMany({
      where: {
        status,
        genre,
        title: search
          ? { contains: search, mode: "insensitive" }
          : undefined,
      },
      orderBy: sortOrderBy(sort),
    }),
    prisma.movie.findMany({
      where: { status },
      select: { genre: true },
      distinct: ["genre"],
      orderBy: { genre: "asc" },
    }),
  ]);

  const carry = { q: search, genre: rawGenre, sort: sort === "title-asc" ? undefined : sort };

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="font-serif text-3xl text-fg-1">What&apos;s on</h1>

      <div className="inline-flex w-fit gap-1 rounded-pill bg-surface-3 p-1">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={buildQuery({ status: tab.value, ...carry })}
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

      <MovieFilters genres={genreRows.map((row) => row.genre)} />

      {movies.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-avatar bg-surface-3">
            <Film className="h-6 w-6 text-fg-3" strokeWidth={1.75} />
          </span>
          <p className="font-medium text-fg-1">
            {search || genre
              ? "No movies match your search"
              : "No movies in this category yet"}
          </p>
          <p className="text-sm text-fg-2">
            {search || genre
              ? "Try a different title or genre."
              : "Check back soon — new titles are added every week."}
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
