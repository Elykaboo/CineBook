import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isProtectedRoute =
        isAdminRoute || nextUrl.pathname.startsWith("/bookings");

      if (!isProtectedRoute) return true;
      if (!isLoggedIn) return false;
      if (isAdminRoute && auth.user.role !== "ADMIN") {
        return Response.redirect(new URL("/bookings", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
