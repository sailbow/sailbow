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
import { toast } from "./ui/toast";
import { useState } from "react";

interface TextEditorProps {
  text: string | null;
  isEditing: boolean;
  onTextChange: (newText: string) => void;
}
const useTextEditor = ({ text, isEditing, onTextChange }: TextEditorProps) => {
  return useEditor(
    {
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
          placeholder: "Trip details, contact info, etc...",
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
      content: text,
      onUpdate: ({ editor }) => {
        onTextChange(editor.getHTML());
      },
      editable: isEditing,
      editorProps: {
        attributes: {
          class:
            "prose max-w-5xl m-4 prose-p:my-0 focus:outline-none dark:prose-invert",
        },
      },
    },
    [isEditing],
  );
};

const TextEditorContent = ({
  editor,
}: {
  editor: Editor | null;
  className?: string | undefined;
}) => {
  return (
    <Card className="flex max-h-[500px] min-h-[300px] flex-col overflow-auto">
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
    <div className="sticky top-0 z-30 flex flex-row flex-wrap items-center gap-1 bg-background">
      <Toggle
        size="sm"
        pressed={editor.isActive("heading")}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
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

export { useTextEditor, TextEditorContent, TextEditorToolbar };
