import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteMovie } from "@/actions/admin";

export default async function AdminMoviesPage() {
  const movies = await prisma.movie.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Movies</h1>
        <Link
          href="/admin/movies/new"
          className="bg-black text-white rounded px-4 py-2 text-sm"
        >
          New Movie
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{movie.title}</p>
              <p className="text-sm text-gray-500">
                {movie.genre} · {movie.durationMinutes} min · {movie.status}
              </p>
            </div>
            <div className="flex gap-3 items-center text-sm">
              <Link href={`/admin/movies/${movie.id}/edit`} className="underline">
                Edit
              </Link>
              <form action={deleteMovie}>
                <input type="hidden" name="movieId" value={movie.id} />
                <button type="submit" className="text-red-600 underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
