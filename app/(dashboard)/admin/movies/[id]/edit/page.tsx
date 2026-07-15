import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMovie } from "@/actions/admin";
import { Card } from "@/components/ui/card";
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
      <h1 className="font-serif text-2xl text-fg-1">Edit movie</h1>
      <Card className="w-full max-w-lg p-5">
        <MovieForm
          action={updateMovie.bind(null, movie.id)}
          defaultValues={movie}
          submitLabel="Save changes"
        />
      </Card>
    </div>
  );
}
