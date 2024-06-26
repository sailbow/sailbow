"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { boatId: string } }) {
  const router = useRouter();
  const { mutate: deleteBoatById, isLoading: isDeletingBoat } =
    api.dock.deleteBoatById.useMutation({
      onSuccess: () => {
        router.push("/dock");
        router.refresh();
      },
    });

  const deleteBoat = () => {
    deleteBoatById({ boatId: parseInt(params.boatId) });
  };

  return (
    <div className="mt-2 size-full overflow-y-auto sm:mt-0">
      <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
        Settings
      </h1>
      <Button
        variant="destructive"
        disabled={isDeletingBoat}
        onClick={deleteBoat}
      >
        Delete boat
      </Button>
    </div>
  );
}
