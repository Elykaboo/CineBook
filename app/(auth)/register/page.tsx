import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/bookings");
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <RegisterForm />
    </div>
  );
}
