"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { loginUser, type AuthFormState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <Input label="Email" name="email" type="email" required />
      <Input label="Password" name="password" type="password" required />

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
        {pending ? "Signing in..." : "Log in"}
      </Button>

      <p className="text-center text-sm text-fg-2">
        New to CineBook?{" "}
        <Link href="/register" className="text-fg-brand hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
