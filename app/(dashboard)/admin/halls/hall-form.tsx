"use client";

import { useActionState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { createHall, type AdminFormState } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AdminFormState = {};

export function HallForm() {
  const [state, formAction, pending] = useActionState(
    createHall,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error && !state.fieldErrors) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Input
        label="Hall name"
        name="name"
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
          required
          className="flex-1"
          error={state.fieldErrors?.columns?.[0]}
        />
      </div>

      <div className="flex items-start gap-2 rounded-input bg-surface-brand-subtle p-3 text-sm text-teal-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span>The seat grid is generated automatically from rows × columns.</span>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create hall"}
      </Button>
    </form>
  );
}
