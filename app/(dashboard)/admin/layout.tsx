import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 p-8">
      <nav className="flex gap-4 text-sm border-b pb-3">
        <Link href="/admin">Overview</Link>
        <Link href="/admin/movies">Movies</Link>
        <Link href="/admin/halls">Halls</Link>
        <Link href="/admin/showtimes">Showtimes</Link>
        <Link href="/admin/bookings">Bookings</Link>
      </nav>
      {children}
    </div>
  );
}
