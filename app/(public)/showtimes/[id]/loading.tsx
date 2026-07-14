import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <span className="sr-only">Loading seat map…</span>
      <div>
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-1.5 w-full max-w-md" />
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6.5 w-64" />
          ))}
        </div>
      </div>
    </div>
  );
}
