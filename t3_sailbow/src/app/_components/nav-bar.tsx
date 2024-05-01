import { UserDropdown } from "./user-dropdown";
import NotificationsDropdown from "./notifications-dropdown";
import Crumbs from "./crumbs";
import {
  ClerkLoaded,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Image from "next/image";
import { Spinner } from "./spinner";
import { Button } from "@/components/ui/button";
import Sidebar from "./side-bar";
import BoatSearch from "./boat-search";

export function Navbar() {
  return (
    <header
      className="
  max-h-navbar-height min-h-navbar-height fixed top-0 z-40 flex w-full items-center
  gap-2 border-b-[1px] border-border/40 bg-background/90 xs:px-4"
    >
      <Image
        width={24}
        height={24}
        src="/icon.svg"
        alt="Sailbow Icon"
        className="hidden xs:flex"
      />
      <SignedIn>
        <div className="hidden xs:flex">
          <Crumbs />
        </div>
        <div className="flex items-center xs:hidden">
          <Sidebar />
          <BoatSearch />
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
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
}
