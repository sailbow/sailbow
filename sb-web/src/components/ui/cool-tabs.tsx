"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CoolTab {
  id: string;
  label: string;
}

interface CoolTabsProps {
  tabs: CoolTab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function CoolTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: CoolTabsProps) {
  const [buttonRefs] = React.useState<Map<string, HTMLButtonElement>>(
    new Map(),
  );
  const [activeRect, setActiveRect] = React.useState<{
    width: number;
    left: number;
  } | null>(null);

  // Use useLayoutEffect to measure DOM elements
  React.useLayoutEffect(() => {
    const activeButton = buttonRefs.get(activeTab);
    if (activeButton) {
      setActiveRect({
        width: activeButton.offsetWidth,
        left: activeButton.offsetLeft,
      });
    }
  }, [activeTab, buttonRefs]);

  return (
    <div
      className={cn("relative inline-flex h-10 items-center gap-3", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) buttonRefs.set(tab.id, el);
          }}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative py-2 text-sm font-medium transition-colors",
            tab.id === activeTab ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}

      {/* Animated underline */}
      {activeRect && (
        <motion.div
          className="absolute bottom-0 h-[2px] bg-primary"
          initial={false}
          animate={{
            width: activeRect.width,
            x: activeRect.left,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
    </div>
  );
}
