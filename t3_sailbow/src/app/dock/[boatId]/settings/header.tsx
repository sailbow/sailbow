"use client";

import { Navbar } from "@/app/_components/nav-bar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalActiveBoat } from "@/hooks/use-boat";
import Link from "next/link";
import { useEffect } from "react";

export default function SettingsHeader() {
  const { activeBoat } = useGlobalActiveBoat();
  useEffect(() => {
    if (activeBoat) console.log(activeBoat);
  }, [activeBoat]);
  return (
    <Navbar>
      <div className="flex items-center">
        <Breadcrumb>
          <BreadcrumbList className="text-lg">
            <BreadcrumbLink asChild>
              <Link href="/dock">My boats</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator className="[&>svg]:size-lg hidden sm:inline-flex" />
            {activeBoat ? (
              <BreadcrumbLink asChild>
                <Link href={`/dock/${activeBoat.id}`}>{activeBoat.name}</Link>
              </BreadcrumbLink>
            ) : (
              <Skeleton className="h-6 w-10" />
            )}
            <BreadcrumbSeparator className="[&>svg]:size-lg" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-primary">
                Settings
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </Navbar>
  );
}
