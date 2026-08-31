"use client";
import {
  SignInButton,
  SignUpButton,
  ClerkLoaded,
  useAuth,
} from "@clerk/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) return null;

  return (
    <ClerkLoaded>
      <header
        className={cn(
          "fixed top-0 z-40 flex max-h-navbar-height min-h-navbar-height w-dvw items-center justify-end gap-2 border-b-[1px] border-border/40 bg-background/90 px-4",
          className,
        )}
      >
        <SignUpButton mode="modal" signInFallbackRedirectUrl="/trips">
          <Button variant="outline" className="bg-transparent text-black">
            Sign Up
          </Button>
        </SignUpButton>
        <SignInButton mode="modal" signUpFallbackRedirectUrl="/trips">
          <Button>Sign In</Button>
        </SignInButton>
      </header>
    </ClerkLoaded>
  );
}
