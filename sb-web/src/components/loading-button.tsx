"use client";

import type React from "react";

import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoadingButton({
  isLoading,
  children,
  onClick,
  disabled,
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonProps & { isLoading: boolean }) {
  return (
    <Button {...props}>
      <div className="relative flex items-center justify-center">
        <span
          className={`transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
        >
          {children}
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
    </Button>
  );
}
