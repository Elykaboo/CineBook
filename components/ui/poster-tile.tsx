import { cn } from "@/lib/cn";

const tints = ["teal", "neutral", "amber", "red", "violet", "blue"] as const;
type Tint = (typeof tints)[number];

const tintClasses: Record<Tint, string> = {
  teal: "bg-poster-teal-bg text-poster-teal-fg",
  neutral: "bg-poster-neutral-bg text-poster-neutral-fg",
  amber: "bg-poster-amber-bg text-poster-amber-fg",
  red: "bg-poster-red-bg text-poster-red-fg",
  violet: "bg-poster-violet-bg text-poster-violet-fg",
  blue: "bg-poster-blue-bg text-poster-blue-fg",
};

function tintForTitle(title: string): Tint {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) | 0;
  }
  return tints[Math.abs(hash) % tints.length];
}

export function PosterTile({
  title,
  genre,
  rating,
  className,
}: {
  title: string;
  genre: string;
  rating: string;
  className?: string;
}) {
  const tint = tintForTitle(title);

  return (
    <div
      className={cn(
        "relative flex aspect-2/3 w-full flex-col justify-between overflow-hidden rounded-card p-3",
        tintClasses[tint],
        className
      )}
    >
      <span className="font-mono text-2xs uppercase tracking-widest opacity-80">
        {genre}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-lg leading-snug">{title}</h3>
        <span className="self-start rounded-chip bg-black/20 px-2 py-0.5 font-mono text-2xs">
          {rating}
        </span>
      </div>
    </div>
  );
}
