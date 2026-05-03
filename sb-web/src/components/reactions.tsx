"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Plus, Smile } from "lucide-react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "./ui/emoji-picker";
import { cn } from "@/lib/utils";
import { RD, RDContent, RDTrigger } from "./ui/responsive-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReactionsProps {
  reactions: Record<string, { users: string[]; isActive: boolean }>;
  onClickReaction: (reaction: string) => void;
  className?: string;
}

export const Reactions = (props: ReactionsProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className={cn("flex flex-wrap gap-1.5", props.className)}>
      {Object.entries(props.reactions).map(([emoji, data]) => {
        return (
          <Button
            key={emoji}
            variant={"outline"}
            className={cn(
              "aspect-square size-10 shrink-0 p-2",
              data.isActive && "ring-2 ring-ring",
            )}
            onClick={() => props.onClickReaction(emoji)}
          >
            {emoji}
            {data.users.length ? <span>{data.users.length}</span> : undefined}
          </Button>
        );
      })}
      <RD
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        desktopMode="popover"
      >
        <RDTrigger asChild>
          <Button variant="secondary" className="aspect-square size-10 p-2">
            <Smile />
          </Button>
        </RDTrigger>
        <RDContent
          className="max-w-fit p-0"
          drawerContentClassName="justify-center"
        >
          <div className="flex items-center justify-center">
            <EmojiPicker
              className="h-[500px] xs:h-[300px]"
              onEmojiSelect={({ emoji }) => {
                props.onClickReaction(emoji);
                setIsPickerOpen(false);
              }}
            >
              <EmojiPickerSearch autoFocus={!isMobile} />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </div>
        </RDContent>
      </RD>
    </div>
  );
};
