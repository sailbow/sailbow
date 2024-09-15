import { UserDropdown } from "./user-dropdown";
import NotificationsDropdown from "./notifications";
import Crumbs from "./crumbs";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Sidebar from "./side-bar";
import TripSearch from "./trip-search";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header
      className="
  fixed top-0 z-40 flex max-h-navbar-height min-h-navbar-height w-dvw items-center
  justify-stretch gap-4 border-b-[1px] border-border/40 bg-background/90 px-4"
    >
      <div className="hidden sm:flex">
        <Image width={24} height={24} src="/icon.svg" alt="Sailbow Icon" />
      </div>
      <div className="flex-1">
        <div className="hidden sm:flex">
          <Crumbs />
        </div>
        <div className="flex max-w-full items-center gap-2 sm:hidden">
          <Sidebar />
          <TripSearch />
        </div>
      </div>
      <div className="flex-none gap-2">
        <div className="flex items-center gap-2">
          <SignedIn>
            <NotificationsDropdown />
            <UserDropdown />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" signUpFallbackRedirectUrl={"/trips"}>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      {/* <div className="flex-none">

      </div>
      <div className="flex max-w-full grow items-center gap-2">
        <SignedIn>
          <div className="hidden sm:flex">
            <Crumbs />
          </div>
          <div className="flex shrink items-center gap-2 sm:hidden">
            <Sidebar />
            <TripSearch />
          </div>
        </SignedIn>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <SignedIn>
            <NotificationsDropdown />
            <UserDropdown />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" signUpFallbackRedirectUrl={"/trips"}>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div> */}
    </header>
  );
}
