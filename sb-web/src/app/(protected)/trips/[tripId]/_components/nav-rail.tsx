"use client";

import { useState } from "react";
import {
  ListChecks,
  MessageCircle,
  BarChart3,
  Volume2,
  Pencil,
  Compass,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

const topItems: NavItem[] = [
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { id: "stats", label: "Insights", icon: BarChart3 },
  { id: "audio", label: "Audio", icon: Volume2 },
  { id: "edit", label: "Edit", icon: Pencil },
  { id: "explore", label: "Explore", icon: Compass },
];

const bottomItem: NavItem = {
  id: "settings",
  label: "Settings",
  icon: Settings,
};

export function GlassNavRail() {
  const [active, setActive] = useState("tasks");

  const renderButton = (item: NavItem) => {
    const isActive = active === item.id;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setActive(item.id)}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
          isActive
            ? "bg-primary/15 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]"
            : "text-foreground/55 hover:bg-foreground/10 hover:text-foreground",
        )}
      >
        {/* active indicator bar */}
        <span
          className={cn(
            "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-all duration-300",
            isActive ? "opacity-100" : "opacity-0",
          )}
        />

        <Icon className="h-5 w-5" strokeWidth={2} />

        {item.badge ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white shadow-md">
            {item.badge}
          </span>
        ) : null}

        {/* tooltip */}
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium",
            "translate-x-[-4px] bg-foreground text-background opacity-0 transition-all duration-200",
            "group-hover:translate-x-0 group-hover:opacity-100",
          )}
        >
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex h-full flex-col items-center justify-between rounded-3xl p-2.5",
        // glassmorphism
        "border border-white/15 bg-white/10 backdrop-blur-xl",
        "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45)]",
        // subtle top sheen
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/15 before:to-transparent before:content-['']",
        "relative overflow-visible",
      )}
    >
      <div className="flex flex-col items-center gap-1.5">
        {topItems.map(renderButton)}
      </div>

      <div className="flex w-full flex-col items-center gap-1.5">
        <span className="my-1 h-px w-6 bg-white/15" aria-hidden="true" />
        {renderButton(bottomItem)}
      </div>
    </nav>
  );
}
