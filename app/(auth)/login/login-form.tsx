"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type AuthFormState } from "@/actions/auth";
import { FormError } from "@/components/form-error";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
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
      </div>

      <FormError message={state?.error} />

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-sm text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </form>
  );
}
