"use client";

import { useActionState, useRef, useEffect } from "react";
import { createHall, type AdminFormState } from "@/actions/admin";
import { FieldError } from "@/components/form-error";

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
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-wrap gap-3 items-end border rounded p-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Hall Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="border rounded px-3 py-2"
        />
        <FieldError messages={state.fieldErrors?.name} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="rows" className="text-sm font-medium">
          Rows
        </label>
        <input
          id="rows"
          name="rows"
          type="number"
          min={1}
          max={50}
          required
          className="border rounded px-3 py-2 w-24"
        />
        <FieldError messages={state.fieldErrors?.rows} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="columns" className="text-sm font-medium">
          Columns
        </label>
        <input
          id="columns"
          name="columns"
          type="number"
          min={1}
          max={26}
          required
          className="border rounded px-3 py-2 w-24"
        />
        <FieldError messages={state.fieldErrors?.columns} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Hall"}
      </button>
    </form>
  );
}
