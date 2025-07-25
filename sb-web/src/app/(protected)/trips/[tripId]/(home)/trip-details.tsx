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
    <div className="relative flex size-full max-h-full max-w-5xl pb-4">
      {!isEditing && (
        <Button
          className="absolute right-1 top-1 z-10"
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
        >
          <Edit />
        </Button>
      )}
      <TextEditor
        isEditable={isEditing}
        content={descriptionText}
        onTextChange={(newText) => {
          setDescriptionText(newText);
        }}
        placeholder={"Trip details, extra info, etc."}
      />
      {isEditing && (
        <div className="absolute right-2 top-1.5 flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
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
