"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import type { EditorEvents } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  CheckSquare,
  Quote,
  Code,
  Code2,
  Minus,
  Undo2,
  Redo2,
  Link as LinkIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { updateTripAction } from "@/actions/trips";
import { useTripNotesLiveDraft } from "@/hooks/useTripNotesLiveDraft";
import { mergeExpectedUpdatedAt } from "@/lib/concurrency";
import { fetchTripById } from "@/lib/api/trips";
import { formatApiErrorMessage, tripSaveErrorDescription } from "@/lib/api-error-message";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  parseStoredTripNotes,
  TRIP_NOTES_STORAGE_MAX_CHARS,
} from "@/lib/trip-notes-doc";
import { getStablePaletteColorForUserId } from "@/lib/route-colors";
import {
  dispatchPeerDraftDecorations,
  tripNotesPeerDraftPluginKey,
  TripNotesPeerDraftDecoration,
  plainOffsetToDocPos,
} from "@/lib/trip-notes-peer-draft-decoration";

import "./trip-notes-editor.css";

const AUTOSAVE_MS = 200;

type SaveState = "idle" | "saving" | "saved" | "error";

function useEditorRerender(editor: Editor | null) {
  const [, force] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    if (!editor) {
      return undefined;
    }
    const onTx = () => force();
    editor.on("transaction", onTx);
    return () => {
      editor.off("transaction", onTx);
    };
  }, [editor]);
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 shrink-0", isActive && "bg-accent text-accent-foreground")}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={isActive}
    >
      {children}
    </Button>
  );
}

function NotesToolbar({ editor }: { editor: Editor | null }) {
  const { t } = useTranslation();
  useEditorRerender(editor);

  if (!editor) {
    return (
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-2 min-h-[48px] rounded-t-xl" />
    );
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(
      t("trip_notes.link_prompt", { defaultValue: "Link URL" }),
      prev ?? "https://",
    );
    if (url === null) {
      return;
    }
    const trimmed = url.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  };

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-2 rounded-t-xl"
      role="toolbar"
      aria-label={t("trip_notes.toolbar_a11y", { defaultValue: "Formatting" })}
    >
      <ToolbarButton
        title={t("trip_notes.tool_bold", { defaultValue: "Bold" })}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_italic", { defaultValue: "Italic" })}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_strike", { defaultValue: "Strikethrough" })}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border shrink-0" aria-hidden />
      <ToolbarButton
        title={t("trip_notes.tool_h2", { defaultValue: "Heading 2" })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_h3", { defaultValue: "Heading 3" })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border shrink-0" aria-hidden />
      <ToolbarButton
        title={t("trip_notes.tool_bullet", { defaultValue: "Bullet list" })}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_ordered", { defaultValue: "Numbered list" })}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_tasks", { defaultValue: "Task list" })}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive("taskList")}
      >
        <CheckSquare className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border shrink-0" aria-hidden />
      <ToolbarButton
        title={t("trip_notes.tool_quote", { defaultValue: "Quote" })}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_code", { defaultValue: "Inline code" })}
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_code_block", { defaultValue: "Code block" })}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
      >
        <Code2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_hr", { defaultValue: "Divider" })}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title={t("trip_notes.tool_link", { defaultValue: "Link" })} onClick={setLink}>
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border shrink-0" aria-hidden />
      <ToolbarButton
        title={t("trip_notes.tool_undo", { defaultValue: "Undo" })}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title={t("trip_notes.tool_redo", { defaultValue: "Redo" })}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function TripNotesEditor({
  tripId,
  tripUpdatedAt,
  initialNotesRaw,
  onSaveStateChange,
  className,
  displayName = "",
  canEdit = true,
}: {
  tripId: string;
  /** Pass `trip.updated_at` so stale saves send `expected_updated_at`. */
  tripUpdatedAt?: string | null;
  initialNotesRaw: string | null | undefined;
  onSaveStateChange?: (state: SaveState) => void;
  /** Merged onto root Card — use `flex-1 min-h-0` to grow in a flex column layout. */
  className?: string;
  displayName?: string;
  canEdit?: boolean;
}) {
  const { t } = useTranslation();
  const { peerDraft, broadcastDraft } = useTripNotesLiveDraft(canEdit ? tripId : undefined, displayName);
  const peerColor = peerDraft ? getStablePaletteColorForUserId(peerDraft.userId) : null;
  const tripVersionRef = useRef({ updated_at: tripUpdatedAt });
  const lastServerSerializedRef = useRef<string | null>(null);
  const isApplyingRemoteRef = useRef(false);
  const persistQueueRef = useRef({ inFlight: false, queued: false });

  useEffect(() => {
    tripVersionRef.current = { updated_at: tripUpdatedAt };
  }, [tripUpdatedAt]);
  const [initialDoc] = useState(() => parseStoredTripNotes(initialNotesRaw));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tripIdRef = useRef(tripId);
  tripIdRef.current = tripId;

  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    onSaveStateChange?.(saveState);
  }, [saveState, onSaveStateChange]);

  useEffect(() => {
    setSaveState("idle");
    lastServerSerializedRef.current = null;
  }, [tripId]);

  const persist = useCallback(
    async (ed: Editor, opts?: { retrying?: boolean }) => {
      if (!canEdit) {
        return;
      }
      if (isApplyingRemoteRef.current) {
        return;
      }
      const json = ed.getJSON();
      const serialized = JSON.stringify(json);
      if (serialized.length > TRIP_NOTES_STORAGE_MAX_CHARS) {
        setSaveState("error");
        toast.error(t("trip_notes.oversize_title", { defaultValue: "Notes are too large" }), {
          description: t("trip_notes.oversize_body", {
            defaultValue: "Remove some content and try again.",
          }),
        });
        return;
      }
      const plain = ed.getText().trim();
      const payload = plain === "" ? { notes: null } : { notes: serialized };
      setSaveState("saving");
      let result: Awaited<ReturnType<typeof updateTripAction>>;
      try {
        result = await updateTripAction(
          tripIdRef.current,
          mergeExpectedUpdatedAt(tripVersionRef.current, payload),
        );
      } catch (e) {
        setSaveState("error");
        toast.error(t("trip_overview.notes_save_failed", { defaultValue: "Could not save notes" }), {
          description: e instanceof Error ? tripSaveErrorDescription(e.message, t) : tripSaveErrorDescription("Request failed", t),
        });
        return;
      }

      if (!result.success) {
        if (result.conflict === true && !opts?.retrying) {
          // Optimistic-lock conflict: fetch latest server notes and rebase our retry once.
          const localSerialized = serialized;
          const localDoc = json;
          const cursorPlainOffset = ed.state.doc.textBetween(0, ed.state.selection.from, "\n\n").length;

          try {
            const latest = await fetchTripById(tripIdRef.current);
            const remoteDoc = parseStoredTripNotes(latest.notes);
            const remoteSerialized = JSON.stringify(remoteDoc);

            tripVersionRef.current = { updated_at: latest.updated_at };
            lastServerSerializedRef.current = remoteSerialized;

            // Avoid overwriting new user edits that happened while the save was in-flight.
            const currentSerialized = JSON.stringify(ed.getJSON());
            if (currentSerialized === localSerialized) {
              if (process.env.NODE_ENV !== "production") {
                console.debug("[TripNotesEditor] Conflict rebase: applying remote then local snapshot");
              }
              isApplyingRemoteRef.current = true;
              try {
                ed.commands.setContent(remoteDoc, { emitUpdate: false });
                ed.commands.setContent(localDoc, { emitUpdate: false });

                // Best-effort restore cursor near its previous plain-text offset.
                const restoredDocPos = plainOffsetToDocPos(ed.state.doc, cursorPlainOffset);
                ed.commands.setTextSelection({ from: restoredDocPos, to: restoredDocPos });
              } finally {
                isApplyingRemoteRef.current = false;
              }
            }

            // Retry once with the updated expected_updated_at.
            const retryJson = ed.getJSON();
            const retrySerialized = JSON.stringify(retryJson);
            if (retrySerialized.length > TRIP_NOTES_STORAGE_MAX_CHARS) {
              setSaveState("error");
              toast.error(t("trip_notes.oversize_title", { defaultValue: "Notes are too large" }), {
                description: t("trip_notes.oversize_body", {
                  defaultValue: "Remove some content and try again.",
                }),
              });
              return;
            }

            const retryPlain = ed.getText().trim();
            const retryPayload = retryPlain === "" ? { notes: null } : { notes: retrySerialized };

            let retryResult: Awaited<ReturnType<typeof updateTripAction>>;
            try {
              retryResult = await updateTripAction(
                tripIdRef.current,
                mergeExpectedUpdatedAt(tripVersionRef.current, retryPayload),
              );
            } catch (retryErr) {
              setSaveState("error");
              toast.error(t("trip_overview.notes_save_failed", { defaultValue: "Could not save notes" }), {
                description:
                  retryErr instanceof Error
                    ? tripSaveErrorDescription(retryErr.message, t)
                    : tripSaveErrorDescription("Request failed", t),
              });
              return;
            }

            if (!retryResult.success) {
              setSaveState("error");
              toast.error(t("trip_overview.notes_save_failed", { defaultValue: "Could not save notes" }), {
                description: tripSaveErrorDescription(formatApiErrorMessage(retryResult.error), t),
              });
              return;
            }

            if (retryResult.data.updated_at) {
              tripVersionRef.current = { updated_at: retryResult.data.updated_at };
            }
            lastServerSerializedRef.current = retrySerialized;

            setSaveState("saved");
            window.setTimeout(() => {
              setSaveState("idle");
            }, 2000);
            return;
          } catch (conflictErr) {
            setSaveState("error");
            toast.error(t("trip_overview.notes_save_failed", { defaultValue: "Could not save notes" }), {
              description:
                conflictErr instanceof Error ? tripSaveErrorDescription(conflictErr.message, t) : tripSaveErrorDescription("Request failed", t),
            });
            return;
          }
        }

        setSaveState("error");
        toast.error(t("trip_overview.notes_save_failed", { defaultValue: "Could not save notes" }), {
          description: tripSaveErrorDescription(formatApiErrorMessage(result.error), t),
        });
        return;
      }
      if (result.data.updated_at) {
        tripVersionRef.current = { updated_at: result.data.updated_at };
      }
      lastServerSerializedRef.current = serialized;
      setSaveState("saved");
      window.setTimeout(() => {
        setSaveState("idle");
      }, 2000);
    },
    [t, canEdit],
  );

  const scheduleSave = useCallback(
    (editor: Editor) => {
      if (!canEdit) {
        return;
      }
      if (isApplyingRemoteRef.current) {
        return;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;

        if (persistQueueRef.current.inFlight) {
          persistQueueRef.current.queued = true;
          return;
        }

        persistQueueRef.current.inFlight = true;
        void (async () => {
          try {
            await persist(editor);
            while (persistQueueRef.current.queued) {
              persistQueueRef.current.queued = false;
              await persist(editor);
            }
          } finally {
            persistQueueRef.current.inFlight = false;
          }
        })();
      }, AUTOSAVE_MS);
    },
    [persist, canEdit],
  );

  useEffect(
    () => () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    },
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
      Placeholder.configure({
        placeholder: t("trip_notes.editor_placeholder", {
          defaultValue: "Plans, packing lists, links, ideas…",
        }),
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TripNotesPeerDraftDecoration,
    ],
    content: initialDoc,
    editorProps: {
      attributes: {
        class: "trip-notes-editor",
        spellCheck: "true",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isApplyingRemoteRef.current) {
        return;
      }
      if (canEdit) {
        const from = ed.state.selection.from;
        const cursorPosition = ed.state.doc.textBetween(0, from, "\n\n").length;
        broadcastDraft(ed.getText(), cursorPosition);
      }
      scheduleSave(ed);
    },
    onSelectionUpdate: ({ editor: ed }) => {
      if (isApplyingRemoteRef.current) {
        return;
      }
      if (!canEdit) {
        return;
      }
      const from = ed.state.selection.from;
      const cursorPosition = ed.state.doc.textBetween(0, from, "\n\n").length;
      broadcastDraft(ed.getText(), cursorPosition);
    },
    editable: canEdit,
  });

  // Initialize baseline so we can safely apply server updates only when local hasn't diverged.
  useEffect(() => {
    if (!editor) {
      return;
    }
    if (lastServerSerializedRef.current === null) {
      lastServerSerializedRef.current = JSON.stringify(editor.getJSON());
    }
  }, [editor]);

  /** Apply server notes after a collaborator save without remounting the editor. */
  useEffect(() => {
    if (!editor) {
      return;
    }
    if (isApplyingRemoteRef.current) {
      return;
    }
    const nextDoc = parseStoredTripNotes(initialNotesRaw);
    const nextSerialized = JSON.stringify(nextDoc);
    const currentSerialized = JSON.stringify(editor.getJSON());
    if (nextSerialized === currentSerialized) {
      return;
    }
    const baselineSerialized = lastServerSerializedRef.current;
    const locallyDiverged = baselineSerialized !== null && currentSerialized !== baselineSerialized;
    if (locallyDiverged) {
      return;
    }

    const cursorPlainOffset = editor.state.doc.textBetween(0, editor.state.selection.from, "\n\n").length;
    if (process.env.NODE_ENV !== "production") {
      console.debug("[TripNotesEditor] Applying server notes to editor", {
        diverged: locallyDiverged,
        baselinePresent: baselineSerialized !== null,
      });
    }
    isApplyingRemoteRef.current = true;
    try {
      editor.commands.setContent(nextDoc, { emitUpdate: false });

      // Best-effort: keep caret near its previous plain-text offset.
      const restoredDocPos = plainOffsetToDocPos(editor.state.doc, cursorPlainOffset);
      editor.commands.setTextSelection({ from: restoredDocPos, to: restoredDocPos });
      lastServerSerializedRef.current = nextSerialized;
    } finally {
      isApplyingRemoteRef.current = false;
    }
  }, [editor, initialNotesRaw]);

  useEffect(() => {
    if (!editor?.view) {
      return undefined;
    }
    const applyPeerDecorations = () => {
      if (!peerDraft || !peerColor) {
        dispatchPeerDraftDecorations(editor.view, null, peerColor ?? "#3b82f6");
        return;
      }
      dispatchPeerDraftDecorations(editor.view, peerDraft, peerColor);
    };
    const onEditorTransaction = ({ transaction }: EditorEvents["transaction"]) => {
      // Decoration sync dispatches a meta-only transaction; skip it or we recurse.
      if (transaction.getMeta(tripNotesPeerDraftPluginKey) !== undefined) {
        return;
      }
      applyPeerDecorations();
    };
    applyPeerDecorations();
    editor.on("transaction", onEditorTransaction);
    return () => {
      editor.off("transaction", onEditorTransaction);
    };
  }, [editor, peerDraft, peerColor]);

  return (
    <Card
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border-border bg-card shadow-sm dark:border-white/[0.08]",
        className,
      )}
    >
      {peerDraft && peerColor ? (
        <div
          className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span
            className="h-2 w-0.5 shrink-0 rounded-full"
            style={{ backgroundColor: peerColor }}
            aria-hidden
          />
          {peerDraft.avatarUrl ? (
            <img
              src={peerDraft.avatarUrl}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted"
              aria-hidden
            >
              <User className="h-3.5 w-3.5" />
            </div>
          )}
          <p className="min-w-0 flex-1 font-medium text-foreground/80">
            {t("trip_notes.peer_editing", {
              defaultValue: "{{name}} is editing…",
              name: peerDraft.displayName,
            })}
          </p>
        </div>
      ) : null}
      <NotesToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="trip-notes-editor trip-notes-editor--scroll text-card-foreground min-h-0 flex-1 overflow-y-auto"
      />
    </Card>
  );
}
