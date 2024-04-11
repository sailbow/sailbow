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
        <div className="flex items-center">
            <Breadcrumb>
                <BreadcrumbList className="text-lg max-h-8 overflow-hidden">
                    <BreadcrumbItem className="hidden xs:inline-flex">
                        <BreadcrumbLink asChild>
                            <Link href="/dock">My Boats</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="[&>svg]:size-lg hidden xs:inline-flex" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary font-semibold">{boat?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}