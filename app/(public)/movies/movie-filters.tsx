"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const SORTS = [
  { label: "Title (A–Z)", value: "title-asc" },
  { label: "Shortest first", value: "duration-asc" },
  { label: "Longest first", value: "duration-desc" },
] as const;

export function MovieFilters({ genres }: { genres: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current);
      if (query.trim()) params.set("q", query.trim());
      else params.delete("q");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(handle);
  }, [query, pathname, router]);

  function updateParam(name: string, value: string, defaultValue: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== defaultValue) params.set(name, value);
    else params.delete(name);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-48 flex-1 flex-col gap-1.5">
        <label htmlFor="q" className="text-xs font-medium text-fg-2">
          Search
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3"
            strokeWidth={1.75}
          />
          <input
            id="q"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="h-[34px] w-full rounded-input border border-border-1 bg-surface-1 pl-9 pr-3 text-sm text-fg-1 placeholder:text-fg-3 transition-colors duration-150 focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="genre" className="text-xs font-medium text-fg-2">
          Genre
        </label>
        <select
          id="genre"
          value={searchParams.get("genre") ?? "ALL"}
          onChange={(e) => updateParam("genre", e.target.value, "ALL")}
          className="h-[34px] rounded-input border border-border-1 bg-surface-1 px-3 text-sm text-fg-1 transition-colors duration-150 focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]"
        >
          <option value="ALL">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sort" className="text-xs font-medium text-fg-2">
          Sort by
        </label>
        <select
          id="sort"
          value={searchParams.get("sort") ?? "title-asc"}
          onChange={(e) => updateParam("sort", e.target.value, "title-asc")}
          className="h-[34px] rounded-input border border-border-1 bg-surface-1 px-3 text-sm text-fg-1 transition-colors duration-150 focus-visible:outline-none focus-visible:[box-shadow:var(--ring-focus)]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
