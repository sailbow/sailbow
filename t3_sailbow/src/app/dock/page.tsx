
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
        <div className="min-h-full p-4 space-y-4 flex flex-col">
            <div className="flex flex-wrap items-center justify-between w-full">
                <h1 className="text-2xl sm:text-4xl font-semibold">My boats</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {boats?.map(boat => {
                    return (
                        <BoatCard key={boat.id} boat={boat} />
                    )
                })}
            </div>
        </div>
    )
}