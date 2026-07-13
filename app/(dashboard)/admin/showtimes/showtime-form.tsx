"use client";

import { useActionState } from "react";
import { createShowtime, type AdminFormState } from "@/actions/admin";
import { FormError, FieldError } from "@/components/form-error";

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
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="movieId" className="text-sm font-medium">
          Movie
        </label>
        <select
          id="movieId"
          name="movieId"
          required
          className="border rounded px-3 py-2"
        >
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
        <FieldError messages={state.fieldErrors?.movieId} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="hallId" className="text-sm font-medium">
          Hall
        </label>
        <select
          id="hallId"
          name="hallId"
          required
          className="border rounded px-3 py-2"
        >
          {halls.map((hall) => (
            <option key={hall.id} value={hall.id}>
              {hall.name}
            </option>
          ))}
        </select>
        <FieldError messages={state.fieldErrors?.hallId} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="startTime" className="text-sm font-medium">
          Start Time
        </label>
        <input
          id="startTime"
          name="startTime"
          type="datetime-local"
          required
          className="border rounded px-3 py-2"
        />
        <FieldError messages={state.fieldErrors?.startTime} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-sm font-medium">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          className="border rounded px-3 py-2"
        />
        <FieldError messages={state.fieldErrors?.price} />
      </div>

      <FormError message={state.error} />

      <button
        type="submit"
        disabled={pending || movies.length === 0 || halls.length === 0}
        className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Showtime"}
      </button>

      {(movies.length === 0 || halls.length === 0) && (
        <p className="text-sm text-gray-500">
          Add at least one movie and one hall before creating a showtime.
        </p>
      )}
    </form>
  );
}
