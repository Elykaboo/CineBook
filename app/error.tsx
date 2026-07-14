"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-avatar bg-red-50">
        <TriangleAlert className="h-6 w-6 text-red-600" strokeWidth={1.75} />
      </span>
      <h1 className="font-serif text-xl text-fg-1">Something went wrong</h1>
      <p className="max-w-sm text-sm text-fg-2">
        We couldn&apos;t load this page. This is usually temporary — try
        again in a moment.
        {error.digest && (
          <span className="mt-1 block font-mono text-2xs text-fg-3">
            Error reference: {error.digest}
          </span>
        )}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
