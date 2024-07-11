"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useBoat } from "@/hooks/use-boat";

export default function DeleteBoat() {
  const { id: boatId } = useBoat();
  const router = useRouter();
  const { mutateAsync: deleteBoatById, isLoading: isDeletingBoat } =
    api.dock.deleteBoatById.useMutation({
      onError: (error) => {
        toast.dismiss();
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("You do not have permission to delete this boat!");
        } else {
          toast.error("Something went wrong, please try again later");
        }
      },
    });

  const deleteBoat = async () => {
    toast.promise(deleteBoatById({ boatId: boatId }), {
      loading: "Deleting...",
      success: () => {
        router.push("/dock");
        router.refresh();
        return "Success!";
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>These actions cannot be undone</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete boat</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this boat?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={deleteBoat}
                disabled={isDeletingBoat}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
