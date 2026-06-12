import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

import type { TripNotesLiveDraftPeer } from "@/hooks/useTripNotesLiveDraft";

/** Matches TipTap `Editor.getText()` default block separator. */
const PLAIN_BLOCK_SEPARATOR = "\n\n";

export const tripNotesPeerDraftPluginKey = new PluginKey("tripNotesPeerDraft");

function docPlainText(doc: ProseMirrorNode): string {
  return doc.textBetween(0, doc.content.size, PLAIN_BLOCK_SEPARATOR);
}

/** Maps a plain-text offset (TipTap `getText` space) to a document position. */
export function plainOffsetToDocPos(doc: ProseMirrorNode, targetOffset: number): number {
  if (targetOffset <= 0) {
    return 0;
  }
  const fullLen = docPlainText(doc).length;
  if (targetOffset >= fullLen) {
    return doc.content.size;
  }
  let lo = 0;
  let hi = doc.content.size;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const len = doc.textBetween(0, mid, PLAIN_BLOCK_SEPARATOR).length;
    if (len < targetOffset) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

function longestCommonPrefix(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) {
    i += 1;
  }
  return i;
}

function peerHighlightStyle(color: string): string {
  return `background: color-mix(in oklch, ${color} 22%, transparent); border-radius: 2px;`;
}

function createCaretWithAvatar(
  color: string,
  avatarUrl: string | null,
  displayName: string,
): HTMLSpanElement {
  const wrap = document.createElement("span");
  wrap.className = "trip-notes-peer-caret-wrap";
  wrap.style.setProperty("--peer-color", color);
  wrap.setAttribute("aria-hidden", "true");

  const caret = document.createElement("span");
  caret.className = "trip-notes-peer-caret";
  wrap.appendChild(caret);

  const chip = document.createElement("span");
  chip.className = "trip-notes-peer-avatar-chip";
  if (avatarUrl) {
    const img = document.createElement("img");
    img.src = avatarUrl;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    chip.appendChild(img);
  } else {
    const initial =
      displayName.trim().length > 0 ? displayName.trim().charAt(0).toUpperCase() : "?";
    chip.textContent = initial;
  }
  wrap.appendChild(chip);

  return wrap;
}

function createSuffixElement(text: string, color: string): HTMLSpanElement {
  const wrap = document.createElement("span");
  wrap.className = "trip-notes-peer-draft-suffix";
  wrap.style.setProperty("--peer-color", color);
  wrap.textContent = text;
  return wrap;
}

export function buildPeerDraftDecorationSet(
  doc: ProseMirrorNode,
  peer: TripNotesLiveDraftPeer,
  color: string,
): DecorationSet {
  const localPlain = docPlainText(doc);
  const peerPlain = peer.text;
  const common = longestCommonPrefix(localPlain, peerPlain);
  const caretPlain = Math.max(
    0,
    Math.min(peer.cursorPosition ?? peerPlain.length, peerPlain.length),
  );

  const highlightStart = common;
  const highlightEnd = Math.max(highlightStart, caretPlain);
  const decorations: Decoration[] = [];

  const inDocHighlightEnd = Math.min(highlightEnd, localPlain.length);
  if (inDocHighlightEnd > highlightStart) {
    const from = plainOffsetToDocPos(doc, highlightStart);
    const to = plainOffsetToDocPos(doc, inDocHighlightEnd);
    if (to > from) {
      decorations.push(
        Decoration.inline(from, to, {
          class: "trip-notes-peer-highlight",
          style: peerHighlightStyle(color),
        }),
      );
    }
  }

  const caretDocPos = plainOffsetToDocPos(doc, Math.min(caretPlain, localPlain.length));

  if (highlightEnd > localPlain.length) {
    const suffixStart = Math.max(highlightStart, localPlain.length);
    const suffixText = peerPlain.slice(suffixStart, highlightEnd);
    const widgetPos = plainOffsetToDocPos(doc, localPlain.length);
    decorations.push(
      Decoration.widget(
        widgetPos,
        () => {
          const wrap = document.createElement("span");
          wrap.className = "trip-notes-peer-draft-tail";
          wrap.style.setProperty("--peer-color", color);
          if (suffixText.length > 0) {
            wrap.appendChild(createSuffixElement(suffixText, color));
          }
          wrap.appendChild(
            createCaretWithAvatar(color, peer.avatarUrl, peer.displayName),
          );
          return wrap;
        },
        { side: 1 },
      ),
    );
  } else {
    decorations.push(
      Decoration.widget(
        caretDocPos,
        () => createCaretWithAvatar(color, peer.avatarUrl, peer.displayName),
        { side: 1 },
      ),
    );
  }

  return DecorationSet.create(doc, decorations);
}

export const TripNotesPeerDraftDecoration = Extension.create({
  name: "tripNotesPeerDraft",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: tripNotesPeerDraftPluginKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, set) {
            const meta = tr.getMeta(tripNotesPeerDraftPluginKey);
            if (meta !== undefined) {
              return meta;
            }
            return set.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return tripNotesPeerDraftPluginKey.getState(state) ?? DecorationSet.empty;
          },
        },
      }),
    ];
  },
});

export function dispatchPeerDraftDecorations(
  view: EditorView,
  peer: TripNotesLiveDraftPeer | null,
  color: string,
): void {
  const deco =
    peer && peer.text.length > 0
      ? buildPeerDraftDecorationSet(view.state.doc, peer, color)
      : DecorationSet.empty;
  view.dispatch(view.state.tr.setMeta(tripNotesPeerDraftPluginKey, deco));
}
