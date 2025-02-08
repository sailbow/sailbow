"use client";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  ClerkLoaded,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "fixed top-0 z-40 flex max-h-navbar-height min-h-navbar-height w-dvw items-center justify-stretch gap-4 border-b-[1px] border-border/40 bg-background/90 px-4",
        className,
      )}
    >
      <div className="flex-none gap-2">
        <div className="flex items-center gap-2">
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="modal" signInFallbackRedirectUrl={"/trips"}>
                <Button variant="secondary">Sign Up</Button>
              </SignUpButton>
              <SignInButton mode="modal" signUpFallbackRedirectUrl={"/trips"}>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}
