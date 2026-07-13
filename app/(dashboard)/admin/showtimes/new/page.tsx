import { prisma } from "@/lib/prisma";
import { ShowtimeForm } from "../showtime-form";

export default async function NewShowtimePage() {
  const [movies, halls] = await Promise.all([
    prisma.movie.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    prisma.cinemaHall.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">New Showtime</h1>
      <ShowtimeForm movies={movies} halls={halls} />
    </div>
  );
}
