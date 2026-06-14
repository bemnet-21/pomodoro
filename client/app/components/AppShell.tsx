"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import SideBar from "@/app/components/SideBar";
import AuthGuard from "@/app/components/auth/AuthGuard";

interface AppShellProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [isMobileNavOpen]);

  return (
    <AuthGuard>
      {isPublicRoute ? (
        <main>{children}</main>
      ) : (
        <div className="relative flex min-h-screen bg-background text-white">
          <SideBar className="hidden lg:flex" />

          <div className="flex min-h-screen flex-1 flex-col">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary/15 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Open menu"
                className="grid size-11 place-items-center rounded-lg border border-primary/25 text-text-primary transition hover:border-primary/45 hover:bg-primary/10 active:scale-95"
              >
                <Menu size={18} />
              </button>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">Pomodoro</span>
              <div className="size-11" aria-hidden="true" />
            </header>

            <main className="flex-1">{children}</main>
          </div>

          <div
            className={`fixed inset-0 z-40 transition-opacity duration-200 lg:hidden ${
              isMobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
              <button
                type="button"
                aria-label="Close menu overlay"
                className="absolute inset-0 bg-black/70"
                onClick={() => setIsMobileNavOpen(false)}
              />
              <div
                className={`relative z-10 h-full w-72 max-w-[85vw] transform transition-transform duration-300 ease-out ${
                  isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="flex items-center justify-end border-b border-primary/15 bg-surface px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setIsMobileNavOpen(false)}
                    aria-label="Close menu"
                    className="grid size-11 place-items-center rounded-lg border border-primary/25 text-text-primary transition hover:border-primary/45 hover:bg-primary/10 active:scale-95"
                  >
                    <X size={18} />
                  </button>
                </div>
                <SideBar
                  className="h-[calc(100%-65px)] w-full rounded-none border-r border-primary/20"
                  onNavigate={() => setIsMobileNavOpen(false)}
                />
              </div>
            </div>
        </div>
      )}
    </AuthGuard>
  );
}
