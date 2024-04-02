
import BoatCard from "../_components/boat-card";
import { type Boat } from "@/lib/schemas/boat";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CreateBoatForm } from "../_components/create-boat-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/server";
import { Loader2 } from "lucide-react";

export default async function Page() {
    const boats = await api.dock.getBoats.query();
    return (
        <main className="container mx-auto p-4 space-y-4 flex flex-col">
            <div className="flex flex-wrap items-center justify-between w-full">
                <h1 className="text-2xl sm:text-4xl font-bold">My boats</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>Create a boat</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-none sm:w-3/5  lg:w-2/5">
                        <CreateBoatForm />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {boats?.map(boat => {
                    return (
                        <BoatCard key={boat.id} boat={boat} />
                    )
                })}
            </div>
        </main>
    )
}