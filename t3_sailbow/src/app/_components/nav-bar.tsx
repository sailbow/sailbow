import { UserDropdown } from "./user-dropdown";
import NotificationsDropdown from "./notifications-dropdown";
import Crumbs from "./crumbs";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { Spinner } from "./spinner";
import Sidebar from "./side-bar";
import TripSearch from "./trip-search";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header
      className="
  fixed top-0 z-40 flex max-h-navbar-height min-h-navbar-height w-full items-center
  gap-4 border-b-[1px] border-border/40 bg-background/90 px-4"
    >
      <Image
        width={24}
        height={24}
        src="/icon.svg"
        alt="Sailbow Icon"
        className="hidden sm:flex"
      />
      <SignedIn>
        <div className="hidden sm:flex">
          <Crumbs />
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <Sidebar />
          <TripSearch />
        </div>
      </SignedIn>
      <div className="ml-auto flex items-center gap-2">
        <ClerkLoading>
          <Spinner />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <NotificationsDropdown />
            <UserDropdown />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" signUpFallbackRedirectUrl={"/trips"}>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
}
