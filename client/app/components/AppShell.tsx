"use client";

import { usePathname } from "next/navigation";
import SideBar from "@/app/components/SideBar";
import AuthGuard from "@/app/components/auth/AuthGuard";

interface AppShellProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <AuthGuard>
      {isPublicRoute ? (
        <main>{children}</main>
      ) : (
        <div className="flex min-h-screen max-w-7xl">
          <SideBar />
          <main className="flex-1">{children}</main>
        </div>
      )}
    </AuthGuard>
  );
}
