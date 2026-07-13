import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMovie } from "@/actions/admin";
import { MovieForm } from "../../movie-form";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Movie</h1>
      <MovieForm
        action={updateMovie.bind(null, movie.id)}
        defaultValues={movie}
        submitLabel="Save Changes"
      />
    </div>
  );
}
