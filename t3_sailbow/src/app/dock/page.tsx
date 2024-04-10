
import BoatCard from "../_components/boat-card";
import { api } from "@/trpc/server";
import { Navbar } from "../_components/nav-bar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
    await currentUser();
    const boats = await api.dock.getBoats.query();
    return (
        <div className="h-dvh w-dvw flex flex-col bg-background">
            <Navbar>
                <div className="hidden md:flex items-center">
                    <Breadcrumb>
                        <BreadcrumbList className="text-lg">
                            <BreadcrumbItem>
                                <BreadcrumbPage>My Boats</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </Navbar>
            <main className="flex flex-col p-5 grow overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {boats?.map(boat => {
                        return (
                            <BoatCard key={boat.id} boat={boat} />
                        )
                    })}
                </div>
            </main>
        </div>
    )
}