"use client";

import { Button } from "@/components/ui/button";
import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function SignInButton() {
  const path = usePathname();
  return (
    <ClerkSignInButton
      mode="modal"
      afterSignInUrl={path === "/" ? "/dock" : path}
    >
      <Button size="sm">Sign In</Button>
    </ClerkSignInButton>
  );
}
