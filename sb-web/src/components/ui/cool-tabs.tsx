"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    <div className={cn("relative inline-flex h-10 items-center", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          ref={(el) => {
            if (el) buttonRefs.set(tab.id, el);
          }}
          onClick={() => onChange(tab.id)}
          variant="ghost"
          size="sm"
          className={cn(
            "relative py-2 text-sm font-medium transition-colors hover:bg-transparent",
            tab.id !== activeTab && "text-muted-foreground",
          )}
        >
          {tab.label}
        </Button>
      ))}

      {/* Animated underline */}
      {activeRect && (
        <motion.div
          className="absolute bottom-0 h-0.5 bg-primary"
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
