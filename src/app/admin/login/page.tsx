import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center estate-gradient px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo variant="light" />
        </div>
        <div className="rounded-2xl border bg-card p-8 shadow-2xl">
          <h1 className="text-center text-2xl font-bold">Admin Portal</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Sign in to manage the Simola HOA portal.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-white/70">
          Authorised personnel only. Activity is logged.
        </p>
      </div>
    </div>
  );
}
