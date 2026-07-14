import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/bookings");
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Card className="flex w-full max-w-100 flex-col gap-6 p-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-serif text-2xl text-fg-1">Welcome back</h1>
          <p className="text-sm text-fg-2">Log in to book your next showtime.</p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
