import BoatCard from "../_components/boat-card";
import { api } from "@/trpc/server";
import ErrorPage from "../_components/error-page";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function Page() {
  let boats;
  try {
    boats = await api.dock.getBoats.query();
  } catch (err) {
    console.error(err);
    return <ErrorPage />;
  }

  return (
    <div className="relative mx-auto h-full max-w-6xl overflow-y-auto xs:container">
      <div className="container sticky top-0 z-10 flex items-center justify-between bg-background p-4">
        <div className="text-xl font-medium leading-none tracking-tight">
          Boats
        </div>
        <Link
          href="/dock/new"
          className={cn(buttonVariants({ size: "sm" }), "max-xs:rounded-full")}
        >
          <Plus className="h-6 w-6" />
          <span className="hidden xs:ml-2 xs:inline-flex">Create a boat</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 overflow-hidden p-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {boats.map((boat) => {
          return <BoatCard key={boat.id} boat={boat} />;
        })}
      </div>
    </div>
  );
}
