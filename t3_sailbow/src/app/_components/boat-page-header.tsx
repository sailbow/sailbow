'use client';
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

export default function BoatPageHeader({ boat }: { boat: Boat | undefined }) {
    return (
        <div className="hidden md:flex items-center">
            <Breadcrumb>
                <BreadcrumbList className="text-lg">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dock">My Boats</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="[&>svg]:size-lg" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary font-semibold">{boat?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}