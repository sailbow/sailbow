"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TripSearch from "./trip-search";
import { useTrip } from "@/lib/trip-queries";

export default function Crumbs() {
  const { data: trip } = useTrip();

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap gap-1 whitespace-nowrap sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/trips">Trips</Link>
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {!!trip && <BreadcrumbSeparator />}
        {!!trip && (
          <BreadcrumbItem>
            <TripSearch />
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
