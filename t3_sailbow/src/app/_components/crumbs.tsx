"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useGlobalActiveTrip } from "@/lib/use-trip";
import Link from "next/link";
import { useParams } from "next/navigation";
import TripSearch from "./trip-search";
import { useEffect, useState } from "react";

export default function Crumbs() {
  const params = useParams();
  const { trip } = useGlobalActiveTrip();
  const [showTripSearch, setShowTripSearch] = useState(false);

  useEffect(() => {
    setShowTripSearch(!!trip && Object.keys(params).includes("tripId"));
  }, [trip, params]);

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
        {showTripSearch && <BreadcrumbSeparator />}
        {showTripSearch && (
          <BreadcrumbItem>
            <TripSearch />
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
