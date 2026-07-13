"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-gray-500">
        {error.digest
          ? `Error reference: ${error.digest}`
          : "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="bg-black text-white rounded px-4 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
