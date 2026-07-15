import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteMovie, createMovie } from "@/actions/admin";
import { PosterChip } from "@/components/ui/poster-tile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MovieForm } from "./movie-form";

export default async function AdminMoviesPage() {
  const movies = await prisma.movie.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <h1 className="font-serif text-2xl text-fg-1">Movies</h1>

        {movies.map((movie) => (
          <Card key={movie.id} className="flex items-center gap-3 p-3">
            <PosterChip title={movie.title} />
            <div className="flex-1">
              <p className="font-semibold text-fg-1">{movie.title}</p>
              <p className="font-mono text-xs text-fg-2">
                {movie.genre} · {movie.durationMinutes} min · {movie.rating}
              </p>
            </div>
            <Badge variant={movie.status === "NOW_SHOWING" ? "teal" : "neutral"}>
              {movie.status === "NOW_SHOWING" ? "Now showing" : "Coming soon"}
            </Badge>
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/movies/${movie.id}/edit`}
                className="flex h-8 w-8 items-center justify-center rounded-chip text-fg-2 hover:bg-surface-3 hover:text-fg-1"
                aria-label={`Edit ${movie.title}`}
              >
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
              </Link>
              <form action={deleteMovie}>
                <input type="hidden" name="movieId" value={movie.id} />
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-chip text-fg-2 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${movie.title}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </form>
            </div>
          </Card>
        ))}
      </div>

      <Card className="h-fit w-full p-5 lg:w-96">
        <h2 className="mb-4 font-semibold text-fg-1">New movie</h2>
        <MovieForm action={createMovie} submitLabel="Save movie" />
      </Card>
    </div>
  );
}
