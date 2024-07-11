"use client";

import { cn } from "@/lib/utils";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "./ui/toggle";
import { Bold, Italic, List, ListOrdered, Heading } from "lucide-react";
import { Card } from "./ui/card";

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
      ],
      content: text,
      onUpdate: ({ editor }) => {
        onTextChange(editor.getHTML());
      },
      editable: isEditing,
      editorProps: {
        attributes: {
          class: "size-full prose-sm prose-p:my-1 focus:outline-none",
        },
      },
    },
    [isEditing],
  );
};

const TextEditorContent = ({
  editor,
  className,
}: {
  editor: Editor | null;
  className?: string | undefined;
}) => {
  return (
    <Card className={cn("flex-1 p-4 focus-within:border-input", className)}>
      <EditorContent editor={editor} className="size-full" />
    </Card>
  );
};

const TextEditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor?.isEditable) {
    return null;
  }

  return (
    <div className="sticky top-0 z-30 flex flex-row items-center gap-1 bg-background">
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
        pressed={editor.isActive("heading")}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
      >
        <Heading className="size-4" />
      </Toggle>
    </div>
  );
};

export { useTextEditor, TextEditorContent, TextEditorToolbar };
