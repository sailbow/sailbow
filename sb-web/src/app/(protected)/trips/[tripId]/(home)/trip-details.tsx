"use client";

import CenteredSpinner from "@/app/_components/centered-spinner";
import {
  CompactTextEditor,
  TextEditorContent,
  TextEditorToolbar,
  useTextEditor,
} from "@/components/text-editor";
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
    <div className="flex max-h-full w-full flex-col gap-4 overflow-auto">
      <CompactTextEditor
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isEditable={true}
        content={descriptionText}
        onTextChange={(newText) => {
          setDescriptionText(newText);
        }}
        placeholder={"Trip details, extra info, etc."}
      />
      {isEditing && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setIsEditing(false);
              setDescriptionText(trip.description);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isUpdatingDescription}
            onClick={() =>
              updateTripDescription({
                description: descriptionText ?? "",
                tripId,
              })
            }
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
