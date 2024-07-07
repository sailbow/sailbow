"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGlobalActiveBoat } from "@/hooks/use-boat";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageWithLoader from "./image-with-loader";

const Sidebar = () => {
  const router = useRouter();
  const { activeBoat } = useGlobalActiveBoat();
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full ">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <div className="size-10">
            <ImageWithLoader src="/icon.svg" alt="Sailbow Logo" />
          </div>
        </SheetHeader>
        <div className="mt-4 flex flex-1 flex-col items-stretch space-y-1">
          <Button
            variant="ghost"
            onClick={() => handleNav("/dock")}
            className="justify-start text-base font-medium"
          >
            <Home className="mr-4 size-6" />
            My boats
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="justify-start text-base font-medium"
            asChild
          >
            <Link href="/test">
              <Home className="mr-2 size-6" />
              <Link href="/test">Test</Link>
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
