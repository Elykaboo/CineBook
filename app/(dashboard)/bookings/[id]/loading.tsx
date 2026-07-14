import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex max-w-lg flex-col gap-4 p-8">
      <span className="sr-only">Loading booking…</span>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-48 w-full rounded-card" />
    </div>
  );
}
