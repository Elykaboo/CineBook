"use client";

import { useActionState } from "react";
import type { AdminFormState } from "@/actions/admin";
import { FormError, FieldError } from "@/components/form-error";

const initialState: AdminFormState = {};

type MovieDefaults = {
  title: string;
  description: string;
  genre: string;
  durationMinutes: number;
  posterUrl: string;
  rating: string;
  status: "NOW_SHOWING" | "COMING_SOON";
};

export function MovieForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (
    prevState: AdminFormState,
    formData: FormData
  ) => Promise<AdminFormState>;
  defaultValues?: MovieDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      <Field
        name="title"
        label="Title"
        defaultValue={defaultValues?.title}
        errors={state.fieldErrors?.title}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          required
          rows={4}
          className="border rounded px-3 py-2"
        />
        <FieldError messages={state.fieldErrors?.description} />
      </div>
      <Field
        name="genre"
        label="Genre"
        defaultValue={defaultValues?.genre}
        errors={state.fieldErrors?.genre}
      />
      <Field
        name="durationMinutes"
        label="Duration (minutes)"
        type="number"
        defaultValue={defaultValues?.durationMinutes?.toString()}
        errors={state.fieldErrors?.durationMinutes}
      />
      <Field
        name="posterUrl"
        label="Poster URL"
        defaultValue={defaultValues?.posterUrl}
        errors={state.fieldErrors?.posterUrl}
      />
      <Field
        name="rating"
        label="Rating"
        defaultValue={defaultValues?.rating}
        errors={state.fieldErrors?.rating}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues?.status ?? "COMING_SOON"}
          className="border rounded px-3 py-2"
        >
          <option value="NOW_SHOWING">Now Showing</option>
          <option value="COMING_SOON">Coming Soon</option>
        </select>
      </div>

      <FormError message={state.error} />

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  errors,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  errors?: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required
        className="border rounded px-3 py-2"
      />
      <FieldError messages={errors} />
    </div>
  );
}
