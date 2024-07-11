"use client";

import {
  TextEditorContent,
  TextEditorToolbar,
  useTextEditor,
} from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useBoat } from "@/hooks/use-boat";
import { useIsXs } from "@/hooks/use-media-query";
import { api } from "@/trpc/react";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePageContent() {
  const { id: boatId, description, dispatch } = useBoat();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description);
  const editor = useTextEditor({
    isEditing: isEditingDescription,
    text: descriptionText,
    onTextChange: setDescriptionText,
  });

  const { mutateAsync } = api.dock.editBoatDescription.useMutation({
    onMutate: (data) => {
      dispatch({
        type: "update-description",
        payload: data.description,
      });
      setIsEditingDescription(false);
    },
    onError: (err) => {
      console.error(err);
      toast.dismiss();
    },
  });

  const isXs = useIsXs();

  const updateDescription = () => {
    toast.promise(mutateAsync({ boatId, description: descriptionText }), {
      loading: "Saving description...",
      success: "Successfully saved description!",
      error:
        "Something went wrong saving the description, please try again later",
    });
  };
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
      <TextEditorContent editor={editor} className="flex-1" />
    </div>
  );
}
