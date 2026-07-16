import Link from "next/link";
import { Film, Ticket } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PosterTile } from "@/components/ui/poster-tile";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const [session, movies] = await Promise.all([
    auth(),
    prisma.movie.findMany({
      where: { status: "NOW_SHOWING" },
      orderBy: { title: "asc" },
      take: 4,
    }),
  ]);

  return (
    <div className="flex flex-col gap-16 p-8">
      <section className="flex flex-col items-center gap-5 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-logo bg-surface-brand text-fg-inverse">
          <Ticket className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h1 className="max-w-lg font-serif text-4xl leading-tight text-fg-1">
          Book your seat before the lights go down
        </h1>
        <p className="max-w-md text-base text-fg-2">
          Browse what&apos;s playing, pick your seats, and get your ticket in
          minutes.
        </p>
        <div className="flex gap-3">
          <Link href="/movies" className={buttonVariants({ size: "lg" })}>
            Browse movies
          </Link>
          {!session?.user && (
            <Link
              href="/register"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Create an account
            </Link>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-fg-1">Now showing</h2>
          <Link
            href="/movies"
            className="text-sm text-fg-brand hover:underline"
          >
            View all
          </Link>
        </div>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-avatar bg-surface-3">
              <Film className="h-6 w-6 text-fg-3" strokeWidth={1.75} />
            </span>
            <p className="font-medium text-fg-1">Nothing playing just yet</p>
            <p className="text-sm text-fg-2">
              Check back soon — new titles are added every week.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 md:grid-cols-4">
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
                  <h3 className="text-sm font-semibold leading-tight text-fg-1">
                    {movie.title}
                  </h3>
                  <p className="font-mono text-xs text-fg-2">
                    {movie.genre} · {movie.durationMinutes} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
