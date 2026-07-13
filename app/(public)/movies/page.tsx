import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { MovieStatus } from "@prisma/client";

const TABS: { label: string; value: MovieStatus }[] = [
  { label: "Now Showing", value: "NOW_SHOWING" },
  { label: "Coming Soon", value: "COMING_SOON" },
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
      <h1 className="text-2xl font-semibold">Movies</h1>

      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/movies?status=${tab.value}`}
            className={`px-4 py-2 text-sm border-b-2 ${
              status === tab.value
                ? "border-black font-medium"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {movies.length === 0 ? (
        <p className="text-gray-500">No movies in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="flex flex-col gap-2 group"
            >
              <div className="relative aspect-2/3 w-full overflow-hidden rounded bg-gray-100">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div>
                <h2 className="font-medium leading-tight">{movie.title}</h2>
                <p className="text-sm text-gray-500">
                  {movie.genre} · {movie.durationMinutes} min · {movie.rating}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
