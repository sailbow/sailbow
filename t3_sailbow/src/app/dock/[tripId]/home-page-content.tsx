"use client";

import {
  TextEditorContent,
  TextEditorToolbar,
  useTextEditor,
} from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoat } from "@/hooks/use-boat";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { Edit } from "lucide-react";
import { useState } from "react";

export default function HomePageContent() {
  const { _id, description } = useBoat();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description);
  const editor = useTextEditor({
    isEditing: isEditingDescription,
    text: descriptionText,
    onTextChange: setDescriptionText,
  });

  const updateTripDescription = useMutation(
    api.trips.mutations.updateDescription,
  );
  const updateDescription = async () => {
    setIsEditingDescription(false);
    await updateTripDescription({ tripId: _id, description: descriptionText });
  };
  if (!editor) {
    return <Skeleton className="size-full bg-slate-300" />;
  }
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
                setDescriptionText(description);
                setIsEditingDescription(false);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={updateDescription}>
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
