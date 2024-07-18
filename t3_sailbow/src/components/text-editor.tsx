"use client";

import { cn } from "@/lib/utils";
import { type Editor, EditorContent, Extension, useEditor } from "@tiptap/react";
import Placeholder, { type PlaceholderOptions} from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "./ui/toggle";
import { Bold, Italic, List, ListOrdered, Heading } from "lucide-react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

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
          placeholder: "A description of your trip...",
          emptyEditorClass: "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:text-mauve-11 before:opacity-50 before-pointer-events-none",
        })
      ],
      content: text,
      onUpdate: ({ editor }) => {
        onTextChange(editor.getHTML());
      },
      editable: isEditing,
      editorProps: {
        attributes: {
          class: "prose prose-sm m-4 prose-p:my-0 focus:outline-none",
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
    <Card className="flex flex-col relative size-full overflow-auto">
      <EditorContent editor={editor} className="relative size-full rounded-lg" />
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
