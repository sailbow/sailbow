"use client";

import { type Boat } from "@/lib/schemas/boat";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function BoatPageHeader({ boat }: { boat: Boat | undefined }) {
    const isAboveThreshold = useMediaQuery("(max-width: 330px)");
    return (
        <div className="flex items-center">
            <Breadcrumb>
                <BreadcrumbList className="text-lg max-h-8 overflow-hidden">
                    {!isAboveThreshold && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dock">My Boats</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="[&>svg]:size-lg" />
                        </>
                    )}
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary font-semibold">{boat?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}