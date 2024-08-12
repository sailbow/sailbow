"use client";

import {
  TextEditorContent,
  TextEditorToolbar,
  useTextEditor,
} from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useUpdateDescription } from "@/lib/trip-mutations";
import { useActiveTripId, useTrip } from "@/lib/trip-queries";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePageContent() {
  const { data: trip, isLoading: isTripLoading } = useTrip();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState<string | undefined>();
  const editor = useTextEditor({
    isEditing: isEditingDescription,
    text: descriptionText ?? "",
    onTextChange: setDescriptionText,
  });
  const tripId = useActiveTripId();

  const { mutate: updateTripDescription, isPending: isUpdatingDescription } =
    useUpdateDescription({
      onSuccess: () => {
        toast.success("Updated trip description");
        setIsEditingDescription(false);
      },
    });

  useEffect(() => {
    if (!!trip?.description && !!editor && !editor.isEditable) {
      editor.chain().setContent(trip.description).run();
      setDescriptionText(trip.description);
    }
  }, [trip?.description, editor, descriptionText]);

  if (!editor || isTripLoading) {
    return <Skeleton className="size-full bg-slate-300" />;
  }

  if (!trip) return;

  return (
    <div className="flex size-full flex-col gap-2">
      {isEditingDescription ? (
        <div className="flex w-full gap-2">
          <TextEditorToolbar editor={editor} />
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setDescriptionText(trip.description);
                setIsEditingDescription(false);
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
        </div>
      ) : (
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditingDescription(true);
            }}
          >
            <Edit className="mr-2 size-6" />
            Edit description
          </Button>
        </div>
      )}
      <TextEditorContent editor={editor} />
    </div>
  );
}
