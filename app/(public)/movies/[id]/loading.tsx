import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 p-8 md:flex-row">
      <span className="sr-only">Loading movie…</span>
      <Skeleton className="aspect-2/3 w-full max-w-xs shrink-0 rounded-card" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-20 w-full max-w-2xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
