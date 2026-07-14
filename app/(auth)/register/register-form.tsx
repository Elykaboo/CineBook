"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { registerUser, type AuthFormState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <Input
        label="Full name"
        name="name"
        type="text"
        required
        error={state?.fieldErrors?.name?.[0]}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        required
        error={state?.fieldErrors?.email?.[0]}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        error={state?.fieldErrors?.password?.[0]}
        helperText={
          state?.fieldErrors?.password
            ? undefined
            : "Use 8 or more characters with a mix of letters and numbers."
        }
      />

      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-input border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span>{state.error}</span>
        </div>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-fg-2">
        Already have an account?{" "}
        <Link href="/login" className="text-fg-brand hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
