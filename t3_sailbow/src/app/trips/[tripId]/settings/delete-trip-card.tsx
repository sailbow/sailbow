"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useState } from "react";
import { useActiveTripId } from "@/lib/trip-queries";
import { useDeleteTrip } from "@/lib/trip-mutations";

export default function DeleteTripCard() {
  const tripId = useActiveTripId();
  const router = useRouter();
  const [wasDeleted, setWasDeleted] = useState(false);
  const { mutate, isPending } = useDeleteTrip({
    onMutate: () => {
      toast.info("Deleting...");
    },
    onSuccess: () => {
      setWasDeleted(true);
      toast.dismiss();
      toast.success("Deleted successfully");
    },
    onError: () => toast.error("Something went wrong, please try again later."),
  });

  const deleteTrip = () => {
    mutate({ tripId });
    router.push("/trips");
  };

  return (
    <Card className="max-w-2xl">
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
                onClick={deleteTrip}
                disabled={isPending || wasDeleted}
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
