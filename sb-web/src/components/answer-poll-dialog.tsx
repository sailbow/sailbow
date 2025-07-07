"use client";

import { Doc, Id } from "@convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import LoadingButton from "./loading-button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Poll } from "./types";

export const AnswerPollDialog = ({
  poll,
  open,
  onOpenChange,
  isLoading,
  handleSubmit,
  userId,
}: {
  poll: Poll;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  handleSubmit: (choices: Id<"pollOptions">[]) => void | Promise<unknown>;
  userId: Id<"users">;
}) => {
  const initialChoices = useMemo(
    () => poll.responses.find((r) => r.userId === userId)?.choices ?? [],
    [userId, poll.responses],
  );
  const [choices, setChoices] = useState(initialChoices);
  useEffect(() => {
    if (!open) {
      setChoices(initialChoices);
    }
  }, [open, initialChoices]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80dvh] sm:max-w-[500px]">
        <DialogHeader className="pb-4">
          <DialogTitle>{poll.title}</DialogTitle>
        </DialogHeader>
        {poll.settings.allowMultiple ? (
          <div className="flex flex-col gap-3">
            {poll.options.map(({ _id, value }) => (
              <div key={_id} className="flex items-center gap-2">
                <Checkbox
                  checked={choices.includes(_id)}
                  className="size-5"
                  defaultChecked={false}
                  onCheckedChange={(checked) => {
                    setChoices((currentChoices) => {
                      if (checked) return [...currentChoices, _id];
                      return currentChoices.filter((v) => v !== _id);
                    });
                  }}
                />
                <Label className="text-base">{value}</Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup
            value={choices.values().toArray()[0] ?? null}
            onValueChange={(value) => setChoices([value as Id<"pollOptions">])}
          >
            {poll.options.map(({ _id, value }) => (
              <div key={_id} className="flex items-center gap-3">
                <RadioGroupItem className="size-5" value={_id} />
                <Label className="text-base">{value}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        <DialogFooter className="mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={isLoading}
            disabled={isLoading || choices.length < 1}
            onClick={() => handleSubmit(choices.values().toArray())}
          >
            Submit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
