"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

const BROADCAST_DEBOUNCE_MS = 150;
const LIVE_DRAFT_EVENT = "notes_draft";

export interface TripNotesLiveDraftPeer {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  text: string;
  cursorPosition?: number;
}

export interface TripNotesLiveDraftPayload {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  text: string;
  cursorPosition?: number;
}

function isLiveDraftPayload(value: unknown): value is TripNotesLiveDraftPayload {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const o = value;
  return (
    "userId" in o &&
    typeof o.userId === "string" &&
    "displayName" in o &&
    typeof o.displayName === "string" &&
    "text" in o &&
    typeof o.text === "string"
  );
}

/**
 * Ephemeral co-editing drafts over Supabase Realtime broadcast (not persisted notes).
 */
export function useTripNotesLiveDraft(tripId: string | undefined, displayName: string) {
  const { user, accessToken, loading: authLoading } = useAuth();
  const [peerDraft, setPeerDraft] = useState<TripNotesLiveDraftPeer | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const channelReadyRef = useRef(false);

  const selfAvatarUrl =
    typeof user?.avatar_url === "string" && user.avatar_url.trim().length > 0
      ? user.avatar_url.trim()
      : null;

  const selfLabel =
    displayName.trim().length > 0
      ? displayName.trim()
      : typeof user?.email === "string" && user.email.length > 0
        ? user.email.split("@")[0]
        : "Traveler";

  const broadcastDraft = useCallback(
    (text: string, cursorPosition?: number) => {
      const ch = channelRef.current;
      if (!ch || !user?.id || !tripId || !channelReadyRef.current) {
        return;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        void ch.send({
          type: "broadcast",
          event: LIVE_DRAFT_EVENT,
          payload: {
            userId: user.id,
            displayName: selfLabel,
            avatarUrl: selfAvatarUrl,
            text,
            ...(typeof cursorPosition === "number" ? { cursorPosition } : {}),
          } satisfies TripNotesLiveDraftPayload,
        });
      }, BROADCAST_DEBOUNCE_MS);
    },
    [tripId, user?.id, selfLabel, selfAvatarUrl],
  );

  useEffect(() => {
    if (!tripId || !user?.id || authLoading || !accessToken) {
      channelReadyRef.current = false;
      setPeerDraft(null);
      return undefined;
    }

    void supabase.realtime.setAuth(accessToken);

    const channel = supabase.channel(`trip-notes:${tripId}`);
    channelRef.current = channel;
    channelReadyRef.current = false;

    channel.on("broadcast", { event: LIVE_DRAFT_EVENT }, ({ payload }) => {
      if (!isLiveDraftPayload(payload)) {
        return;
      }
      if (payload.userId === user.id) {
        return;
      }
      if (payload.text.length === 0) {
        setPeerDraft(null);
        return;
      }
      setPeerDraft({
        userId: payload.userId,
        displayName: payload.displayName,
        avatarUrl:
          typeof payload.avatarUrl === "string" && payload.avatarUrl.trim().length > 0
            ? payload.avatarUrl.trim()
            : null,
        text: payload.text,
        cursorPosition:
          typeof payload.cursorPosition === "number" ? payload.cursorPosition : undefined,
      });
    });

    void channel.subscribe((status) => {
      channelReadyRef.current = status === "SUBSCRIBED";
    });

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      channelReadyRef.current = false;
      channelRef.current = null;
      setPeerDraft(null);
      void supabase.removeChannel(channel);
    };
  }, [tripId, user?.id, accessToken, authLoading]);

  return { peerDraft, broadcastDraft };
}
