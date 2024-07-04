"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
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

export function UserDropdown() {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const { setTheme } = useTheme();
  const router = useRouter();

  if (!isLoaded) {
    return <Spinner className="size-4" />;
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
        <Button
          size="icon"
          className="rounded-full bg-transparent p-0 hover:bg-transparent"
        >
          <Avatar className="size-8">
            <AvatarImage
              src={user.imageUrl}
              alt={user.fullName + " profile image"}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
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
            <DropdownMenuSubTrigger asChild>
              <DropdownMenuItem>
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Theme</span>
              </DropdownMenuItem>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
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
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/privacy-policy">
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Privacy policy
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <MessageSquareWarning className="mr-2 h-4 w-4" />
            Send feedback
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            Get help
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut(() => {
              router.push("/");
            })
          }
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
