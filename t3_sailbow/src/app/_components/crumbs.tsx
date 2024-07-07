"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useGlobalActiveBoat } from "@/hooks/use-boat";
import Link from "next/link";
import { useParams } from "next/navigation";
import BoatSearch from "./boat-search";
import { useEffect, useState } from "react";

export default function Crumbs() {
  const params = useParams();
  const { boat } = useGlobalActiveBoat();
  const [showBoatSearch, setShowBoatSearch] = useState(false);

  useEffect(() => {
    setShowBoatSearch(!!boat && Object.keys(params).includes("boatId"));
  }, [boat, params]);

  return (
    <Breadcrumb>
      <BreadcrumbList className="w-full flex-nowrap gap-1 whitespace-nowrap sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dock">Boats</Link>
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {showBoatSearch && <BreadcrumbSeparator />}
        {showBoatSearch && (
          <BreadcrumbItem>
            <BoatSearch />
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
