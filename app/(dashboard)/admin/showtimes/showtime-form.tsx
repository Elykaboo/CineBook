"use client";

import { useActionState } from "react";
import type { AdminFormState } from "@/actions/admin";
import { FormError } from "@/components/form-error";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AdminFormState = {};

type ShowtimeDefaults = {
  movieId: string;
  hallId: string;
  startTime: Date;
  price: string;
};

function toDatetimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function ShowtimeForm({
  movies,
  halls,
  action,
  defaultValues,
  submitLabel = "Add showtime",
}: {
  movies: { id: string; title: string }[];
  halls: { id: string; name: string }[];
  action: (
    prevState: AdminFormState,
    formData: FormData
  ) => Promise<AdminFormState>;
  defaultValues?: ShowtimeDefaults;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Select
        label="Movie"
        name="movieId"
        defaultValue={defaultValues?.movieId}
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
        defaultValue={defaultValues?.hallId}
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
        defaultValue={
          defaultValues ? toDatetimeLocal(defaultValues.startTime) : undefined
        }
        required
        error={state.fieldErrors?.startTime?.[0]}
      />

      <Input
        label="Ticket price"
        name="price"
        type="number"
        step="0.01"
        min="0"
        defaultValue={defaultValues?.price}
        required
        error={state.fieldErrors?.price?.[0]}
      />

      <FormError message={state.error} />

      <Button type="submit" disabled={pending || movies.length === 0 || halls.length === 0}>
        {pending ? "Saving..." : submitLabel}
      </Button>

      {(movies.length === 0 || halls.length === 0) && (
        <p className="text-sm text-fg-3">
          Add at least one movie and one hall before creating a showtime.
        </p>
      )}
    </form>
  );
}
