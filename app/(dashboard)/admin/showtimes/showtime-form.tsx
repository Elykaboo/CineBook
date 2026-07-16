"use client";

import { useActionState } from "react";
import { createShowtime, type AdminFormState } from "@/actions/admin";
import { FormError } from "@/components/form-error";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AdminFormState = {};

export function ShowtimeForm({
  movies,
  halls,
}: {
  movies: { id: string; title: string }[];
  halls: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    createShowtime,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Select
        label="Movie"
        name="movieId"
        required
        error={state.fieldErrors?.movieId?.[0]}
      >
        {movies.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </Select>

      <Select
        label="Hall"
        name="hallId"
        required
        error={state.fieldErrors?.hallId?.[0]}
      >
        {halls.map((hall) => (
          <option key={hall.id} value={hall.id}>
            {hall.name}
          </option>
        ))}
      </Select>

      <Input
        label="Date & time"
        name="startTime"
        type="datetime-local"
        required
        error={state.fieldErrors?.startTime?.[0]}
      />

      <Input
        label="Ticket price"
        name="price"
        type="number"
        step="0.01"
        min="0"
        required
        error={state.fieldErrors?.price?.[0]}
      />

      <FormError message={state.error} />

      <Button type="submit" disabled={pending || movies.length === 0 || halls.length === 0}>
        {pending ? "Adding..." : "Add showtime"}
      </Button>

      {(movies.length === 0 || halls.length === 0) && (
        <p className="text-sm text-fg-3">
          Add at least one movie and one hall before creating a showtime.
        </p>
      )}
    </form>
  );
}
