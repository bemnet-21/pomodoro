"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

const PUBLIC_ROUTES = ["/login", "/signup"];

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/");
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-gray-400 font-mono text-xs tracking-wider uppercase">
        Loading Session...
      </div>
    );
  }

  return <>{children}</>;
}
