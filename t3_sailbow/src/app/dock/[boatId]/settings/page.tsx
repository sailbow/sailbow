"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { boatId: string } }) {
  const router = useRouter();
  const { mutate: deleteBoatById, isLoading: isDeletingBoat } =
    api.dock.deleteBoatById.useMutation({
      onSuccess: async () => {
        router.push("/dock");
        router.refresh();
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("You do not have permission to delete this boat!");
        }
      },
    });

  const deleteBoat = () => {
    deleteBoatById({ boatId: parseInt(params.boatId) });
  };

  return (
    <div className="size-full overflow-y-auto">
      <div className="space-y-2">
        <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
          Settings
        </h1>
        <Button
          size="sm"
          variant="destructive"
          disabled={isDeletingBoat}
          onClick={deleteBoat}
        >
          Delete boat
        </Button>
      </div>
    </div>
  );
}
