import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/movies" className="underline text-sm">
        Back to movies
      </Link>
    </div>
  );
}
