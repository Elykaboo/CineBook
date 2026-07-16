import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateShowtime } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { ShowtimeForm } from "../../showtime-form";

export default async function EditShowtimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [showtime, movies, halls] = await Promise.all([
    prisma.showtime.findUnique({ where: { id } }),
    prisma.movie.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    prisma.cinemaHall.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!showtime) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl text-fg-1">Edit showtime</h1>
      <Card className="w-full max-w-lg p-5">
        <ShowtimeForm
          movies={movies}
          halls={halls}
          action={updateShowtime.bind(null, showtime.id)}
          defaultValues={{
            movieId: showtime.movieId,
            hallId: showtime.hallId,
            startTime: showtime.startTime,
            price: showtime.price.toString(),
          }}
          submitLabel="Save changes"
        />
      </Card>
    </div>
  );
}
