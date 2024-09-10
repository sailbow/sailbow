import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (process.env.WEBSITE_BASE_URL) return process.env.WEBSITE_BASE_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}