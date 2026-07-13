import { createMovie } from "@/actions/admin";
import { MovieForm } from "../movie-form";

export default function NewMoviePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">New Movie</h1>
      <MovieForm action={createMovie} submitLabel="Create Movie" />
    </div>
  );
}
