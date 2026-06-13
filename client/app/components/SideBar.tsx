"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Timer, User, type LucideIcon } from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();

  const ITEMS = [
    {
      label: "Focus",
      icon: Timer,
      path: "/"
    },
    {
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics"
    },
    {
      label: "Logs",
      icon: FileText,
      path: "/logs"
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile"
    },
  ] satisfies Array<{ label: string; icon: LucideIcon; path: string }>;

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col rounded-r-2xl border-r border-primary/20 bg-surface/90 px-5 py-7 backdrop-blur">
      <h1 className="text-sm font-semibold tracking-[0.22em] text-text-primary">POMODORO</h1>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
        return (
          <Link
            key={item.label}
            href={item.path}
            className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left font-mono transition ${
              isActive
                ? "border-primary/40 text-text-primary"
                : "border-transparent text-text-secondary/80 hover:border-primary/25 hover:bg-primary/5 hover:text-text-primary"
            }`}
          >
            <span
              className={`grid size-8 place-items-center rounded-lg transition ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "bg-background/30 text-text-secondary group-hover:text-primary"
              }`}
            >
              <Icon size={16} strokeWidth={1.9} />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
      </nav>

      <p className="border-t border-primary/15 pt-4 text-xs font-mono tracking-wide text-text-secondary/70">
        Stay in flow.
      </p>
    </aside>
  );
};

export default SideBar;
