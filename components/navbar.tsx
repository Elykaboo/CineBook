import Link from "next/link";
import { Clapperboard, Shield } from "lucide-react";
import { auth } from "@/auth";
import { logout } from "@/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <nav className="flex h-14 items-center justify-between border-b border-border-1 bg-surface-1 px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-logo bg-surface-brand text-fg-inverse">
            <Clapperboard className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="font-serif text-lg text-fg-1">CineBook</span>
        </Link>
        <Link href="/movies" className="text-sm text-fg-2 hover:text-fg-1">
          Movies
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <>
            <Link
              href={isAdmin ? "/admin" : "/bookings"}
              className="flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg-1"
            >
              {isAdmin && <Shield className="h-3.5 w-3.5" strokeWidth={1.75} />}
              {isAdmin ? "Admin" : "My bookings"}
            </Link>
            <Avatar
              name={session.user.name ?? "?"}
              variant={isAdmin ? "violet" : "auto"}
              size="sm"
            />
            <span className="text-sm text-fg-1">{session.user.name}</span>
            <form action={logout}>
              <button
                type="submit"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
