import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-serif text-5xl text-teal-500">404</p>
      <h1 className="font-serif text-xl text-fg-1">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-sm text-sm text-fg-2">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/movies" className={buttonVariants({ variant: "primary" })}>
        Back to movies
      </Link>
    </div>
  );
}
