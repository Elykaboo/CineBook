import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/bookings");
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Card className="flex w-full max-w-100 flex-col gap-6 p-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-serif text-2xl text-fg-1">Create an account</h1>
          <p className="text-sm text-fg-2">
            Join CineBook to start booking tickets.
          </p>
        </div>
        <RegisterForm />
      </Card>
    </div>
  );
}
