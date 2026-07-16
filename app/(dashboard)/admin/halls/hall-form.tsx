"use client";

import { useActionState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import type { AdminFormState } from "@/actions/admin";
import { FormError } from "@/components/form-error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AdminFormState = {};

type HallDefaults = {
  name: string;
  rows: number;
  columns: number;
};

export function HallForm({
  action,
  defaultValues,
  submitLabel = "Create hall",
}: {
  action: (
    prevState: AdminFormState,
    formData: FormData
  ) => Promise<AdminFormState>;
  defaultValues?: HallDefaults;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!defaultValues;

  useEffect(() => {
    if (!isEdit && !pending && !state.error && !state.fieldErrors) {
      formRef.current?.reset();
    }
  }, [pending, state, isEdit]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Input
        label="Hall name"
        name="name"
        defaultValue={defaultValues?.name}
        required
        error={state.fieldErrors?.name?.[0]}
      />

      <div className="flex gap-3">
        <Input
          label="Rows"
          name="rows"
          type="number"
          min={1}
          max={50}
          defaultValue={defaultValues?.rows}
          required
          className="flex-1"
          error={state.fieldErrors?.rows?.[0]}
        />
        <Input
          label="Columns"
          name="columns"
          type="number"
          min={1}
          max={26}
          defaultValue={defaultValues?.columns}
          required
          className="flex-1"
          error={state.fieldErrors?.columns?.[0]}
        />
      </div>

      <div className="flex items-start gap-2 rounded-input bg-surface-brand-subtle p-3 text-sm text-teal-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span>
          {isEdit
            ? "Changing rows/columns regenerates the seat grid — blocked if any seat here is already tied to a booking."
            : "The seat grid is generated automatically from rows × columns."}
        </span>
      </div>

      <FormError message={state.error} />

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
