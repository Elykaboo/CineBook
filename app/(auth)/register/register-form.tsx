"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type AuthFormState } from "@/actions/auth";
import { FormError, FieldError } from "@/components/form-error";

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="border rounded px-3 py-2"
        />
        <FieldError messages={state?.fieldErrors?.name} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border rounded px-3 py-2"
        />
        <FieldError messages={state?.fieldErrors?.email} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border rounded px-3 py-2"
        />
        <FieldError messages={state?.fieldErrors?.password} />
      </div>

      <FormError message={state?.error} />

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {pending ? "Creating account..." : "Register"}
      </button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
