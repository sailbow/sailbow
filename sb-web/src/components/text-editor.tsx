"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import { Toggle } from "./ui/toggle";
import { Bold, Italic, List, ListOrdered, Heading, Link } from "lucide-react";
import { Card } from "./ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TextEditorProps {
  content: string | null;
  isEditable: boolean;
  onTextChange: (newText: string) => void;
  placeholder?: string;
}

const useTextEditor = ({
  content,
  isEditable,
  onTextChange,
  placeholder,
}: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        listItem: {
          HTMLAttributes: {
            class: "list-item",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "text-xl font-medium",
          },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Click to edit",
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:text-mauve-11 before:opacity-50 before-pointer-events-none",
        showOnlyWhenEditable: false,
      }),
      LinkExtension.configure({
        HTMLAttributes: {
          class: "text-primary underline font-semibold",
          target: "_blank",
          rel: "noreferrer",
        },
        openOnClick: "whenNotEditable",
      }).extend({ inclusive: false }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onTextChange(editor.getHTML());
    },
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "prose max-w-5xl m-4 prose-p:my-0 focus:outline-none dark:prose-invert",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return editor;
};

const TextEditorContent = ({
  editor,
}: {
  editor: Editor | null;
  className?: string | undefined;
}) => {
  return (
    <Card className="flex min-h-[300px] flex-col">
      <EditorContent editor={editor} className="size-full rounded-lg" />
    </Card>
  );
};

const ConfigureLinkDialog = ({
  editor,
  isOpen,
  setIsOpen,
}: {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const initialUrl = editor.getAttributes("link").href as string;
  const [url, setUrl] = useState<string | undefined>(initialUrl);

  const saveUrl = () => {
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsOpen(false);
      return;
    }
    let newUrl = url.replace("http:", "https:");
    if (!newUrl.startsWith("https://")) {
      newUrl = "https://" + newUrl;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: newUrl,
      })
      .run();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              autoFocus
              placeholder={"https://example.com"}
              value={url}
              onChange={(e) => {
                e.preventDefault();
                setUrl(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" onClick={() => setUrl(initialUrl)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={saveUrl}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TextEditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  if (!editor?.isEditable) {
    return null;
  }

  const isCursorOverLink = !!editor.getAttributes("link").href;

  const handleToggleLink = () => {
    setIsLinkDialogOpen(true);
  };
  return (
    <div className="z-30 flex flex-wrap items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("heading")}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className="hover:fill-accent-foreground"
      >
        <Heading className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={isCursorOverLink}
        onPressedChange={handleToggleLink}
      >
        <Link className="size-4" />
      </Toggle>
      <ConfigureLinkDialog
        editor={editor}
        isOpen={isLinkDialogOpen}
        setIsOpen={setIsLinkDialogOpen}
      />
    </div>
  );
};

const CompactTextEditor = ({
  content,
  onTextChange,
  isEditable,
  isEditing,
  setIsEditing,
  placeholder,
}: TextEditorProps & {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const editor = useTextEditor({
    content,
    onTextChange,
    isEditable,
    placeholder,
  });

  const handleFocusOut = (e: React.FocusEvent) => {
    // Check if the new focus target is still within the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      editor?.chain().blur().run();
    }
  };

  return (
    <div
      onFocus={() => {
        editor?.chain().focus().run();
      }}
      onBlur={handleFocusOut}
      className={cn(
        "relative flex w-full flex-col rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isEditable && "border border-input",
      )}
    >
      <EditorContent
        editor={editor}
        onClick={() => {
          setIsEditing(true);
          editor?.chain().focus().run();
        }}
        className={cn("min-h-6 overflow-y-auto rounded-md")}
      />
      {isEditing && (
        <div className="sticky bottom-0 z-30 flex w-full rounded-t-md border-t border-input">
          <TextEditorToolbar editor={editor} />
        </div>
      )}
    </div>
  );
};

export {
  useTextEditor,
  TextEditorContent,
  TextEditorToolbar,
  CompactTextEditor,
};
