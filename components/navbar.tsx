import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/actions/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-semibold">
        CineBook
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/movies">Movies</Link>

        {session?.user ? (
          <>
            <Link href={session.user.role === "ADMIN" ? "/admin" : "/bookings"}>
              {session.user.role === "ADMIN" ? "Admin" : "My Bookings"}
            </Link>
            <span className="text-gray-500">{session.user.name}</span>
            <form action={logout}>
              <button type="submit" className="underline">
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
