"use client";

import type React from "react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DollarInputProps {
  value?: string | number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const DollarInput = forwardRef<HTMLInputElement, DollarInputProps>(
  (
    {
      value = "",
      onChange,
      onBlur,
      name,
      placeholder = "$0.00",
      error,
      disabled = false,
      required = false,
      className,
    },
    ref,
  ) => {
    const formatCurrency = (cents: number) => {
      const dollars = cents / 100;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(dollars);
    };

    // Convert numeric value to formatted display value
    const getDisplayValue = (val: string | number) => {
      if (!val || val === 0) return "";

      // If it's already a formatted string, extract the numeric value
      if (typeof val === "string" && val.includes("$")) {
        const numericPart = val.replace(/[$,]/g, "");
        const numValue = Number.parseFloat(numericPart) * 100;
        return formatCurrency(numValue);
      }

      // If it's a number, treat as dollars and convert to cents for formatting
      if (typeof val === "number") {
        return formatCurrency(val * 100);
      }

      return "";
    };

    const displayValue = getDisplayValue(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;

      // Remove all non-digit characters
      const digitsOnly = input.replace(/\D/g, "");

      if (digitsOnly === "") {
        onChange?.(0);
        return;
      }

      // Convert to number (treating as cents, return as dollars)
      const cents = Number.parseInt(digitsOnly, 10);
      const dollars = cents / 100;

      onChange?.(dollars);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
        return;
      }

      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
        return;
      }

      // Ensure that it's a number and stop the keypress
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    };

    return (
      <Input
        ref={ref}
        id={name}
        name={name}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          "font-mono text-lg",
          error && "border-red-500 focus-visible:ring-red-500",
          className,
        )}
      />
    );
  },
);

DollarInput.displayName = "DollarInput";

export default DollarInput;
