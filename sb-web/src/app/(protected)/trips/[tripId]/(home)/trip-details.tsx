"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import LoadingButton from "@/components/loading-button";
import { CompactTextEditor, TextEditor } from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useUpdateDescription } from "@/lib/trip-mutations";
import { useActiveTripId, useActiveTrip } from "@/lib/trip-queries";
import { Edit } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function TripDetails() {
  const { data: trip, isLoading: isTripLoading } = useActiveTrip();
  const [descriptionText, setDescriptionText] = useState<string | null>(null);
  const tripId = useActiveTripId();

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateTripDescription, isPending: isUpdatingDescription } =
    useUpdateDescription({
      onSuccess: () => {
        setIsEditing(false);
        toast.success("Updated trip description");
      },
    });

  useEffect(() => {
    if (trip) {
      setDescriptionText(trip.description);
    }
  }, [trip]);

  if (isTripLoading) {
    return <CenteredSpinner />;
  }

  if (!trip) return;

  return (
    <div className="flex w-full flex-col gap-4">
      <TextEditor
        isEditing={isEditing}
        isEditable={true}
        setIsEditing={setIsEditing}
        content={descriptionText}
        onTextChange={(newText) => {
          setDescriptionText(newText);
        }}
        placeholder={
          isEditing ? "Trip details, extra info, etc" : "No details yet!"
        }
      />
      {isEditing && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdatingDescription}
            onClick={() => {
              setDescriptionText(trip.description);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            size="sm"
            isLoading={isUpdatingDescription}
            onClick={() => {
              if (descriptionText !== trip.description) {
                updateTripDescription({
                  description: descriptionText ?? "",
                  tripId,
                });
              } else {
                setIsEditing(false);
              }
            }}
          >
            Save
          </LoadingButton>
        </div>
      )}
    </div>
  );
}
