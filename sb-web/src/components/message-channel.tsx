"use client";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Doc, type Id } from "@convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { format, formatISO, formatRelative } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { buttonVariants } from "./ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { Spinner } from "@/app/_components/spinner";
import { Skeleton } from "./ui/skeleton";
import CenteredSpinner from "@/app/_components/centered-spinner";

type Message = Doc<"messageChannelMessages"> & {
  user: {
    _id: Id<"users">;
    firstName: string;
    lastName: string;
    imageUrl: string;
    isMe: boolean;
  };
};
interface MessageChannelProps {
  messages: Array<Message>;
  onDeleteMessage: (messageId: Id<"messageChannelMessages">) => void;
  messagesLoading: boolean;
  className?: string;
}
export const MessageChannel = ({
  className,
  messages,
  messagesLoading,
}: MessageChannelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={cn("flex w-full max-w-md flex-col overflow-hidden", className)}
    >
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        {messagesLoading ? (
          <CenteredSpinner />
        ) : !messagesLoading && messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">
              No messages yet.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onDelete={(id) => {}}
            />
          ))
        )}
      </div>
    </div>
  );
};

export function ChatMessage({
  message,
  onDelete,
}: {
  message: Message;
  onDelete: (id: Id<"messageChannelMessages">) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 py-1",
        message.user.isMe && "flex-row-reverse",
      )}
    >
      <Avatar className="size-6">
        <AvatarImage
          src={message.user.imageUrl}
          alt={`${message.user.firstName} ${message.user.lastName}`}
        />
        <AvatarFallback>{message.user.firstName}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          message.user.isMe && "items-end",
        )}
      >
        <div
          className={cn(
            "flex items-baseline gap-2",
            message.user.isMe && "flex-row-reverse",
          )}
        >
          <span className="text-sm font-medium text-foreground">
            {message.user.firstName}
          </span>
          <time
            className="text-xs text-muted-foreground"
            dateTime={formatISO(message._creationTime)}
          >
            {format(message._creationTime, "h:mm aaa")}
          </time>
        </div>

        <div
          className={cn(
            "flex items-center gap-1",
            message.user.isMe && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-2 text-sm leading-relaxed",
              message.user.isMe
                ? "rounded-tr-sm bg-primary text-primary-foreground"
                : "rounded-tl-sm bg-accent text-foreground",
            )}
          >
            {message.message}
          </div>

          {message.user.isMe && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 aria-expanded:opacity-100",
                )}
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Message options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={"top"}
                align={message.user.isMe ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => onDelete(message._id)}>
                  <Trash2 className="mr-2 size-4" />
                  Delete message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

type MessageComposerProps = {
  sendMessage: (message: string) => Promise<void>;
  className?: string;
};

export function MessageComposer({
  sendMessage,
  className,
}: MessageComposerProps) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (isLoading) return;
    setIsLoading(true);
    void sendMessage(value)
      .then(() => setValue(""))
      .finally(() => setIsLoading(false));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isLoading) return;
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex max-w-md items-end gap-2", className)}
    >
      <label htmlFor="message-input" className="sr-only">
        Message
      </label>
      <textarea
        id="message-input"
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="max-h-32 min-h-9 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className={cn(buttonVariants({ size: "icon" }), "shrink-0")}
      >
        {isLoading ? (
          <Spinner className="size-4" />
        ) : (
          <SendHorizontal className="size-4" />
        )}
        <span className="sr-only">Send message</span>
      </button>
    </form>
  );
}
