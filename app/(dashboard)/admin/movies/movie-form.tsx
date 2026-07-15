"use client";

import { useActionState } from "react";
import type { AdminFormState } from "@/actions/admin";
import { FormError } from "@/components/form-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        label="Title"
        name="title"
        defaultValue={defaultValues?.title}
        required
        error={state.fieldErrors?.title?.[0]}
      />
      <Textarea
        label="Description"
        name="description"
        defaultValue={defaultValues?.description}
        required
        rows={4}
        error={state.fieldErrors?.description?.[0]}
      />
      <div className="flex gap-3">
        <Input
          label="Genre"
          name="genre"
          defaultValue={defaultValues?.genre}
          required
          className="flex-1"
          error={state.fieldErrors?.genre?.[0]}
        />
        <Input
          label="Duration (minutes)"
          name="durationMinutes"
          type="number"
          defaultValue={defaultValues?.durationMinutes?.toString()}
          required
          className="w-36"
          error={state.fieldErrors?.durationMinutes?.[0]}
        />
      </div>
      <Input
        label="Poster URL"
        name="posterUrl"
        defaultValue={defaultValues?.posterUrl}
        required
        error={state.fieldErrors?.posterUrl?.[0]}
      />
      <div className="flex gap-3">
        <Select
          label="Rating"
          name="rating"
          defaultValue={defaultValues?.rating ?? "PG"}
          className="flex-1"
          error={state.fieldErrors?.rating?.[0]}
        >
          <option value="G">G</option>
          <option value="PG">PG</option>
          <option value="PG-13">PG-13</option>
          <option value="R">R</option>
        </Select>
        <Select
          label="Status"
          name="status"
          defaultValue={defaultValues?.status ?? "COMING_SOON"}
          className="flex-1"
        >
          <option value="NOW_SHOWING">Now showing</option>
          <option value="COMING_SOON">Coming soon</option>
        </Select>
      </div>

      <FormError message={state.error} />

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
