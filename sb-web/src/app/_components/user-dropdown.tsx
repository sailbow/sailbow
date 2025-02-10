"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import {
  ChevronsUpDown,
  FileText,
  HelpCircle,
  LogOut,
  MessageSquareWarning,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "./spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function UserDropdown() {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const { setTheme } = useTheme();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="rouded-full inline-flex size-10 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (!user) {
    return (
      <SignInButton mode="modal">
        <Button>Sign In</Button>
      </SignInButton>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Toggle user dropdown" asChild>
        <SidebarMenuButton size="lg">
          <Avatar className="mr-2 size-8 rounded-lg">
            <AvatarImage
              src={user.imageUrl}
              alt={user.fullName + " profile image"}
            />
            <AvatarFallback>
              <Skeleton className="size-full rounded-lg" />
            </AvatarFallback>
          </Avatar>
          {user?.fullName}
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="top">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium leading-none">{user?.fullName}</p>
            <p className="text-sm leading-none text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => openUserProfile()}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-0">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            router.push("/");
            await signOut();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
