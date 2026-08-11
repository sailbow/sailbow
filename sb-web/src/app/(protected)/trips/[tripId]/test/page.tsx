"use client";

import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className="flex size-full flex-col gap-2 pb-2 pr-24">
      <div className="flex w-full items-center gap-2 bg-card p-4">
        <h3 className="text-lg font-semibold">Test Page</h3>
        <Button className="ml-auto">Test Action</Button>
      </div>
      <div className="flex grow overflow-auto bg-card p-4">
        <div className="flex size-full flex-col gap-2">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border bg-background p-4 shadow-sm"
            >
              <h4 className="font-medium">Item {i + 1}</h4>
              <p className="text-sm text-muted-foreground">
                This is a simple test item.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
