import type { NextAuthConfig } from "next-auth";

// Edge-safe auth configuration. This must NOT import Prisma, bcrypt or any
// Node-only modules, because it is loaded by the middleware (Edge runtime).
// The Credentials provider with its DB-backed `authorize` lives in auth.ts.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "VIEWER";
      }
      return session;
    },
  },
};
