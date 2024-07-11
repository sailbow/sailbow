"use client";

import {
  TextEditorContent,
  TextEditorToolbar,
  useTextEditor,
} from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoat } from "@/hooks/use-boat";
import { Edit } from "lucide-react";
import { useState } from "react";

export default function HomePageContent() {
  const { id: boatId, description, dispatch } = useBoat();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description);
  const editor = useTextEditor({
    isEditing: isEditingDescription,
    text: descriptionText,
    onTextChange: setDescriptionText,
  });

  if (!editor) {
    return <Skeleton className="size-full bg-slate-300" />;
  }
  return (
    <div className="flex h-full flex-col gap-2">
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
            <Button
              size="sm"
              onClick={() => {
                dispatch({
                  type: "update-description",
                  payload: descriptionText,
                });
                setIsEditingDescription(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditingDescription(true);
              editor.commands.focus(0);
            }}
          >
            <Edit className="mr-2 size-6" />
            Edit description
          </Button>
        </div>
      )}
      <TextEditorContent editor={editor} className="flex-1" />
    </div>
  );
}
