"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import { Toggle } from "./ui/toggle";
import { Bold, Italic, List, ListOrdered, Heading, Link } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  FocusEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
interface TextEditorProps {
  content: string | null;
  isEditable: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onTextChange: (newText: string) => void;
  placeholder?: string;
}

const useTextEditor = (props: TextEditorProps) => {
  const editor = useEditor(
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
              class: "list-disc pl-6 my-1",
            },
          },
          heading: {
            HTMLAttributes: {
              class: "text-xl font-medium",
            },
          },
        }),
        Placeholder.configure({
          placeholder: props.placeholder,
          emptyEditorClass:
            "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:text-mauve-11 before:opacity-50 before-pointer-events-none before:text-md",
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
      content: props.content,
      ...(props.isEditable && {
        onUpdate: ({ editor }) => {
          props.onTextChange(editor.getHTML());
        },
      }),
      editable: props.isEditable,
      editorProps: {
        attributes: {
          class:
            "prose max-w-5xl prose-p:my-0  dark:prose-invert focus-visible:outline-none text-md prose-li:my-0 prose-ol:my-0",
        },
      },
    },
    [props.isEditable],
  );

  useEffect(() => {
    if (editor && props.content !== editor.getHTML()) {
      editor.commands.setContent(props.content);
    }
  }, [props.content, editor]);

  return editor;
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
            <Button variant="outline" onClick={() => setUrl(initialUrl)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={saveUrl}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TextEditorToolbar = ({
  editor,
  isEditing,
  className,
}: {
  editor: Editor | null;
  isEditing: boolean;
  className?: string;
}) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const isCursorOverLink = !!editor?.getAttributes("link").href;

  const handleToggleLink = () => {
    setIsLinkDialogOpen(true);
  };
  return (
    <div
      className={cn(
        "flex min-h-12 flex-wrap items-center gap-1 px-1",
        className,
      )}
    >
      {editor?.isEditable && isEditing && (
        <>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading")}
            onPressedChange={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className="hover:text-foreground"
          >
            <Heading className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => {
              editor?.chain().focus().toggleBold().run();
            }}
            className="hover:text-foreground"
          >
            <Bold className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => {
              editor.chain().focus().toggleItalic().run();
            }}
            className="hover:text-foreground"
          >
            <Italic className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
            className="hover:text-foreground"
          >
            <List className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
            className="hover:text-foreground"
          >
            <ListOrdered className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={isCursorOverLink}
            onPressedChange={handleToggleLink}
            className="hover:text-foreground"
          >
            <Link className="size-4" />
          </Toggle>
        </>
      )}
      {editor && (
        <ConfigureLinkDialog
          editor={editor}
          isOpen={isLinkDialogOpen}
          setIsOpen={setIsLinkDialogOpen}
        />
      )}
    </div>
  );
};

const CompactTextEditor = (props: TextEditorProps & { className?: string }) => {
  const editor = useTextEditor(props);
  const [isEditing, setIsEditing] = useState(false);
  const handleFocusIn: FocusEventHandler = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsEditing(true);
    }
  };

  const handleFocusOut: FocusEventHandler = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsEditing(false);
    }
  };
  return (
    <div
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
      className={cn(
        "flex max-h-96 min-h-24 w-full resize-y flex-col overflow-hidden rounded-md bg-background focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed",
        props.isEditable && "border border-input",
        props.className,
      )}
    >
      <EditorContent
        editor={editor}
        className="flex-1 overflow-auto px-3 py-2 focus-visible:outline-none disabled:opacity-50"
      />
      <TextEditorToolbar
        editor={editor}
        isEditing={isEditing}
        className="mt-auto rounded-b-md"
      />
    </div>
  );
};

const TextEditor = (
  props: TextEditorProps & {
    className?: string;
    setIsEditing: (isEditable: boolean) => void;
  },
) => {
  const editor = useTextEditor(props);
  const editorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.isEditing && editor && !editor.isFocused) {
      editor?.chain().focus().run();
    }
  }, [props.isEditing, editor]);
  return (
    <div
      className={cn(
        "relative flex size-full max-h-full flex-col rounded-sm",
        editor &&
          !props.isEditing &&
          editor.isEditable &&
          "cursor-text hover:bg-muted hover:text-muted-foreground",
        props.className,
      )}
      {...(props.isEditable && {
        onClick: () => {
          props.setIsEditing(true);
          editor?.chain().focus().run();
        },
      })}
    >
      {props.isEditing && editor?.isEditable && (
        <TextEditorToolbar
          editor={editor}
          isEditing={editor.isEditable}
          className="sticky left-0 top-0 w-full rounded-sm bg-muted text-muted-foreground shadow-md"
        />
      )}

      <EditorContent
        editor={editor}
        ref={editorRef}
        className="flex-1 overflow-auto px-3 py-2 focus-visible:outline-none"
      />
    </div>
  );
};

export { useTextEditor, TextEditorToolbar, CompactTextEditor, TextEditor };
