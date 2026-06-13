"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  generateIntroMessage,
  generateMatchReason,
  invalidateUserAiCache,
} from "@/lib/ai";
import { buildUserSignals, toUserContext } from "@/lib/matching";

// ---------- Auth ----------

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  });
  if (error) return { error: error.message };
  redirect("/feed");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "")
    .toLowerCase()
    .trim()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9_]/g, "");
  const fullName = String(formData.get("full_name") || "").trim();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: fullName || username },
    },
  });
  if (error) return { error: error.message };
  // handle_new_user() trigger creates the profile row automatically.
  redirect("/onboarding/interests");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    String(formData.get("email") || ""),
  );
  if (error) return { error: error.message };
  return { ok: "Check your email for a reset link." };
}

// ---------- Posts ----------

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
    // notify post author
    const { data: p } = await supabase.from("posts").select("user_id").eq("id", postId).single();
    if (p && p.user_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: p.user_id,
        actor_id: user.id,
        type: "like",
        post_id: postId,
      });
    }
  }
  revalidatePath("/feed");
  return { ok: true };
}

export async function toggleSave(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: existing } = await supabase
    .from("saved_posts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) {
    await supabase.from("saved_posts").delete().eq("id", existing.id);
  } else {
    await supabase.from("saved_posts").insert({ post_id: postId, user_id: user.id });
  }
  revalidatePath("/feed");
  return { ok: true };
}

export async function toggleArchive(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  // Only the post author can archive/unarchive.
  const { data: post } = await supabase
    .from("posts")
    .select("id, user_id, archived_at")
    .eq("id", postId)
    .maybeSingle();
  const p = post as
    | { id: string; user_id: string; archived_at: string | null }
    | null;
  if (!p) return { error: "Post not found" };
  if (p.user_id !== user.id) {
    return { error: "You can only archive your own posts" };
  }

  const nextArchivedAt = p.archived_at ? null : new Date().toISOString();
  const { error } = await supabase
    .from("posts")
    .update({ archived_at: nextArchivedAt })
    .eq("id", postId);
  if (error) return { error: error.message };

  revalidatePath("/feed");
  revalidatePath("/archive");
  revalidatePath("/profile");
  return { ok: true, archived: !!nextArchivedAt };
}

export async function addComment(postId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !content.trim()) return;
  await supabase.from("comments").insert({ post_id: postId, user_id: user.id, content: content.trim() });
  const { data: p } = await supabase.from("posts").select("user_id").eq("id", postId).single();
  if (p && p.user_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: p.user_id,
      actor_id: user.id,
      type: "comment",
      post_id: postId,
      content: content.trim(),
    });
  }
  revalidatePath("/feed");
}

export async function listComments(postId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, content, created_at, user_id, profiles:profiles!comments_user_id_fkey(username, avatar_url)",
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) {
    return {
      error: error.message,
      comments: [] as Array<{
        id: string;
        content: string;
        created_at: string | null;
        username: string;
        avatar_url: string | null;
      }>,
    };
  }
  type Row = {
    id: string;
    content: string;
    created_at: string | null;
    profiles:
      | { username: string; avatar_url: string | null }
      | { username: string; avatar_url: string | null }[]
      | null;
  };
  const comments = ((data ?? []) as Row[]).map((c) => {
    const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
    return {
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      username: prof?.username ?? "user",
      avatar_url: prof?.avatar_url ?? null,
    };
  });
  return { comments };
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  // Preferred path: client already uploaded the file to Storage and is just
  // submitting the public URL + media_type via hidden fields.
  const preUploadedUrl = String(formData.get("media_url") || "").trim();
  const preUploadedType = String(formData.get("media_type") || "").trim();
  const caption = String(formData.get("caption") || "");
  const audioUrl = String(formData.get("audio_url") || "").trim() || null;

  if (preUploadedUrl) {
    const media_type = preUploadedType === "video" ? "video" : "image";
    const { error: insErr } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        image_url: preUploadedUrl,
        caption,
        media_type,
        audio_url: audioUrl,
      });
    if (insErr) return { error: insErr.message };
    redirect("/feed");
  }

  // Legacy path: raw file submitted with the form (images only).
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return { error: "Select a photo or video" };
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from("posts").upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (upErr) return { error: upErr.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("posts").getPublicUrl(path);

  const { error: insErr } = await supabase
    .from("posts")
    .insert({ user_id: user.id, image_url: publicUrl, caption, media_type: "image" });
  if (insErr) return { error: insErr.message };
  redirect("/feed");
}

// ---------- Stories ----------

export async function markStoryViewed(storyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };
  await supabase.from("story_views").upsert(
    { story_id: storyId, viewer_id: user.id },
    { onConflict: "story_id,viewer_id" },
  );
  return { ok: true };
}

export async function toggleStoryLike(storyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: existing } = await supabase
    .from("story_likes")
    .select("id")
    .eq("story_id", storyId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("story_likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("story_likes").insert({
      story_id: storyId,
      user_id: user.id,
    });
    // Notify the story author (skip self-likes).
    const { data: s } = await supabase
      .from("stories")
      .select("user_id")
      .eq("id", storyId)
      .single();
    if (s && s.user_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: s.user_id,
        actor_id: user.id,
        type: "story_like",
        content: null,
      });
    }
  }

  // Return the new state so the client can update without a re-fetch.
  const { count } = await supabase
    .from("story_likes")
    .select("id", { count: "exact", head: true })
    .eq("story_id", storyId);
  return { ok: true, liked: !existing, count: count ?? 0 };
}

export async function reactToStory(storyId: string, emoji: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };
  // Quick emoji reactions notify the author. Skip self-reactions.
  const { data: s } = await supabase
    .from("stories")
    .select("user_id")
    .eq("id", storyId)
    .single();
  if (s && s.user_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: s.user_id,
      actor_id: user.id,
      type: "story_react",
      content: emoji,
    });
  }
  return { ok: true };
}

export async function saveInterests(interests: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };
  const cleaned = Array.from(new Set(interests.map((s) => s.trim()).filter(Boolean))).slice(0, 12);
  const { error } = await supabase
    .from("profiles")
    .update({ interests: cleaned })
    .eq("id", user.id);
  if (error) return { error: error.message };
  redirect("/feed");
}

// ---------- Smart Matching / Connections ----------

export async function requestConnection(
  targetUserId: string,
  message?: string,
  matchScore?: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };
  if (user.id === targetUserId) return { error: "Cannot connect to yourself" };

  // Was there already a request in EITHER direction?
  const { data: existing } = await supabase
    .from("connections")
    .select("id, status, requester_id")
    .or(
      `and(requester_id.eq.${user.id},addressee_id.eq.${targetUserId}),` +
        `and(requester_id.eq.${targetUserId},addressee_id.eq.${user.id})`,
    )
    .maybeSingle();

  if (existing) {
    // If they sent to me and it's pending, treat a click on Connect as accept.
    if (
      existing.status === "pending" &&
      existing.requester_id === targetUserId
    ) {
      return await respondToConnection(existing.id, true);
    }
    return { error: "Request already exists", status: existing.status };
  }

  const intro = (message ?? "").trim() || null;
  const score =
    typeof matchScore === "number" && isFinite(matchScore)
      ? Math.max(0, Math.min(100, Math.round(matchScore)))
      : null;

  const { data: inserted, error: insErr } = await supabase
    .from("connections")
    .insert({
      requester_id: user.id,
      addressee_id: targetUserId,
      intro_message: intro,
      match_score: score,
    })
    .select("id")
    .single();
  if (insErr || !inserted) return { error: insErr?.message ?? "Could not send request" };

  // Notify the target
  await supabase.from("notifications").insert({
    user_id: targetUserId,
    actor_id: user.id,
    type: "connect_request",
    content: intro,
  });

  revalidatePath("/connections");
  revalidatePath("/search");
  return { ok: true, connectionId: inserted.id };
}

export async function respondToConnection(
  connectionId: string,
  accept: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: conn, error: fetchErr } = await supabase
    .from("connections")
    .select("id, requester_id, addressee_id, status")
    .eq("id", connectionId)
    .single();
  if (fetchErr || !conn) return { error: "Request not found" };
  if (conn.addressee_id !== user.id) {
    return { error: "Only the recipient can respond to this request" };
  }
  if (conn.status !== "pending") {
    return { error: "Request is no longer pending" };
  }

  const newStatus = accept ? "accepted" : "declined";
  const { error: updErr } = await supabase
    .from("connections")
    .update({ status: newStatus, responded_at: new Date().toISOString() })
    .eq("id", connectionId);
  if (updErr) return { error: updErr.message };

  if (accept) {
    // Let the requester know their request was accepted.
    await supabase.from("notifications").insert({
      user_id: conn.requester_id,
      actor_id: user.id,
      type: "connect_accepted",
    });
  }

  revalidatePath("/connections");
  revalidatePath("/search");
  return { ok: true };
}

export async function withdrawConnection(connectionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: conn } = await supabase
    .from("connections")
    .select("id, requester_id, status")
    .eq("id", connectionId)
    .single();
  if (!conn) return { error: "Not found" };
  if (conn.requester_id !== user.id || conn.status !== "pending") {
    return { error: "Cannot withdraw" };
  }
  await supabase.from("connections").delete().eq("id", connectionId);
  revalidatePath("/connections");
  return { ok: true };
}

/**
 * Produces an AI-drafted intro message for a Connect request. Called from the
 * ConnectModal when the user clicks Connect. Always resolves — if Anthropic
 * isn't configured or the call fails, returns a plain-text fallback so the
 * modal still renders something sendable.
 */
export async function draftIntroMessage(
  targetUserId: string,
): Promise<{ message: string; reason: string | null; ai: boolean }> {
  const fallback = (targetName: string) =>
    `Hey ${targetName} — came across your profile on Trendly and thought we'd have some overlap. Would love to swap notes sometime.`;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { message: fallback("there"), reason: null, ai: false };
    }
    if (user.id === targetUserId) {
      return { message: "", reason: null, ai: false };
    }

    const [myProfileRes, theirProfileRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("username, full_name, bio")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("username, full_name, bio")
        .eq("id", targetUserId)
        .maybeSingle(),
    ]);

    const myProfile = myProfileRes.data as
      | { username: string; full_name: string | null; bio: string | null }
      | null;
    const theirProfile = theirProfileRes.data as
      | { username: string; full_name: string | null; bio: string | null }
      | null;

    const firstName =
      theirProfile?.full_name?.split(" ")[0] ||
      theirProfile?.username ||
      "there";

    if (!myProfile || !theirProfile) {
      return { message: fallback(firstName), reason: null, ai: false };
    }

    const [mySignals, theirSignals] = await Promise.all([
      buildUserSignals(supabase, user.id),
      buildUserSignals(supabase, targetUserId),
    ]);

    const meCtx = toUserContext(myProfile, mySignals);
    const themCtx = toUserContext(theirProfile, theirSignals);

    // Best-effort reason — nice context for both the prompt and the UI
    const reason = await generateMatchReason(meCtx, themCtx, {
      score: 0,
      skill: 0,
      industry: 0,
      intent: 0,
      behavior: 0,
      network: 0,
    }).catch(() => null);

    const message = await generateIntroMessage(meCtx, themCtx, reason);

    return {
      message: message ?? fallback(firstName),
      reason,
      ai: !!message,
    };
  } catch (err) {
    console.warn("[draftIntroMessage] failed:", err);
    return { message: fallback("there"), reason: null, ai: false };
  }
}

export async function upsertMatchingPrefs(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const industry = String(formData.get("industry") || "").trim().toLowerCase() || null;
  const intent = String(formData.get("intent") || "").trim() || null;
  const looking_for = String(formData.get("looking_for") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const location = String(formData.get("location") || "").trim() || null;

  const { error } = await supabase
    .from("user_matching_prefs")
    .upsert({
      user_id: user.id,
      industry,
      intent,
      looking_for,
      location,
    });
  if (error) return { error: error.message };

  // Signals changed → drop cached AI reasons/intros involving this user.
  const { data: me } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.username) await invalidateUserAiCache(me.username);

  revalidatePath("/search");
  revalidatePath("/profile");
  return { ok: true };
}

// ---------- Collab Lock (verified collaborations) ----------

/**
 * Invite one or more users to verify a collaboration on a proof-of-work post.
 * Only the post author may invite. Users not yet on the platform are ignored
 * silently. Fires a `collab_invite` notification to each invitee so the ask
 * shows up in their inbox.
 *
 * @param postId          PoW post id (must be owned by the caller).
 * @param invitees        Array of either `{ username }` or `{ user_id }`, with
 *                        optional per-row `role` (what they contributed).
 */
export async function inviteCollaborators(
  postId: string,
  invitees: Array<{ username?: string; user_id?: string; role?: string | null }>,
): Promise<{ ok?: true; invited?: number; error?: string }> {
  if (!postId || invitees.length === 0) return { ok: true, invited: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  // Confirm caller owns the post (RLS will also enforce this, but we give a
  // nicer error up front).
  const { data: post } = await supabase
    .from("posts")
    .select("id, user_id, kind")
    .eq("id", postId)
    .maybeSingle();
  if (!post) return { error: "Post not found" };
  if (post.user_id !== user.id) return { error: "Only the post author can invite collaborators" };
  if (post.kind !== "proof_of_work") {
    return { error: "Collaborators can only be added on proof-of-work posts" };
  }

  // Resolve any username-based invites → user_id.
  const byUsername = invitees
    .filter((i) => i.username && !i.user_id)
    .map((i) => i.username!.toLowerCase().replace(/^@+/, ""));

  let resolved: Record<string, string> = {};
  if (byUsername.length > 0) {
    const { data: rows } = await supabase
      .from("profiles")
      .select("id, username")
      .in("username", byUsername);
    type ProfRow = { id: string; username: string };
    resolved = Object.fromEntries(
      ((rows as ProfRow[] | null) ?? []).map((r) => [r.username, r.id]),
    );
  }

  type CollabRow = { post_id: string; user_id: string; role: string | null };
  const rows: CollabRow[] = [];
  for (const inv of invitees) {
    let uid = inv.user_id ?? null;
    if (!uid && inv.username) {
      uid = resolved[inv.username.toLowerCase().replace(/^@+/, "")] ?? null;
    }
    if (!uid) continue;
    if (uid === user.id) continue; // DB trigger would reject anyway
    rows.push({ post_id: postId, user_id: uid, role: inv.role?.trim() || null });
  }
  if (rows.length === 0) return { ok: true, invited: 0 };

  // Upsert so re-invites don't explode the PK constraint (they just re-send
  // the notification). Doesn't resurrect declined rows — still pending only.
  const { error: insErr } = await supabase
    .from("proof_of_work_collaborators")
    .upsert(rows, { onConflict: "post_id,user_id", ignoreDuplicates: true });
  if (insErr) return { error: insErr.message };

  // Notifications — one per invitee
  const notifs = rows.map((r) => ({
    user_id: r.user_id,
    actor_id: user.id,
    type: "collab_invite" as const,
    post_id: r.post_id,
    content: r.role,
  }));
  if (notifs.length > 0) {
    await supabase.from("notifications").insert(notifs);
  }

  revalidatePath("/collabs");
  revalidatePath("/proof");
  return { ok: true, invited: rows.length };
}

/**
 * Invitee accepts or declines a collab request. Only the tagged user (the
 * invitee) may call this — RLS on `proof_of_work_collaborators` allows
 * UPDATE only where `user_id = auth.uid()`.
 */
export async function respondToCollabInvite(
  postId: string,
  accept: boolean,
  note?: string,
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: row } = await supabase
    .from("proof_of_work_collaborators")
    .select("post_id, user_id, status")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row) return { error: "No pending invite found" };
  if (row.status !== "pending") return { error: "Already responded" };

  const newStatus = accept ? "verified" : "declined";
  const { error: updErr } = await supabase
    .from("proof_of_work_collaborators")
    .update({
      status: newStatus,
      responded_at: new Date().toISOString(),
      note: note?.trim() || null,
    })
    .eq("post_id", postId)
    .eq("user_id", user.id);
  if (updErr) return { error: updErr.message };

  if (accept) {
    // Ping the post author so they see the verification happened.
    const { data: post } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .maybeSingle();
    if (post && post.user_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: post.user_id,
        actor_id: user.id,
        type: "collab_verified",
        post_id: postId,
      });
    }
  }

  // Fresh verified collab → cached AI reasons involving this user may now
  // over- or under-value trust. Invalidate.
  const { data: me } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.username) await invalidateUserAiCache(me.username);

  revalidatePath("/collabs");
  revalidatePath("/proof");
  revalidatePath("/profile");
  return { ok: true };
}

/** Post author removes an invite (works whether pending, verified, or declined). */
export async function revokeCollabInvite(
  postId: string,
  invitedUserId: string,
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .maybeSingle();
  if (!post) return { error: "Post not found" };
  if (post.user_id !== user.id) return { error: "Not your post" };

  const { error } = await supabase
    .from("proof_of_work_collaborators")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", invitedUserId);
  if (error) return { error: error.message };

  revalidatePath("/collabs");
  revalidatePath("/proof");
  return { ok: true };
}


// ---------- Collab Lock v2 (project-level) ----------
// A "collaboration" is a first-class entity: initiator + partner + project
// name + linked posts/reels. Stays invisible until the partner verifies.

export async function createCollaboration(input: {
  partnerUsername: string;
  projectName: string;
  description?: string;
  postIds?: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const partnerUsername = input.partnerUsername.trim().replace(/^@/, "").toLowerCase();
  const projectName = input.projectName.trim();
  const description = (input.description ?? "").trim() || null;
  const postIds = (input.postIds ?? []).filter(Boolean);

  if (!partnerUsername) return { error: "Partner username is required" };
  if (!projectName) return { error: "Project name is required" };

  // Resolve partner.
  const { data: partner } = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .eq("username", partnerUsername)
    .maybeSingle();
  const p = partner as { id: string; username: string; full_name: string | null } | null;
  if (!p) return { error: `User @${partnerUsername} not found` };
  if (p.id === user.id) return { error: "You can't collaborate with yourself" };

  // Insert the collaboration row.
  const { data: inserted, error: insErr } = await supabase
    .from("collaborations")
    .insert({
      initiator_id: user.id,
      partner_id: p.id,
      project_name: projectName,
      description,
    })
    .select("id")
    .single();
  const row = inserted as { id: string } | null;
  if (insErr || !row) {
    return { error: insErr?.message ?? "Could not create collaboration" };
  }

  // Link posts (must be authored by the initiator — RLS enforces this too).
  if (postIds.length > 0) {
    // Filter to the initiator's own posts for safety.
    const { data: myPosts } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", user.id)
      .in("id", postIds);
    const mine = ((myPosts ?? []) as Array<{ id: string }>).map((r) => r.id);
    if (mine.length > 0) {
      await supabase
        .from("collaboration_posts")
        .insert(mine.map((post_id) => ({ collab_id: row.id, post_id })));
    }
  }

  // Notify the partner.
  await supabase.from("notifications").insert({
    user_id: p.id,
    actor_id: user.id,
    type: "collab_project_invite",
    collab_id: row.id,
  });

  revalidatePath("/collabs");
  return { ok: true, collabId: row.id };
}

export async function respondToCollaboration(
  collabId: string,
  accept: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  // Verify the user is actually the partner on this collab.
  const { data: collabRow } = await supabase
    .from("collaborations")
    .select("id, initiator_id, partner_id, status, project_name")
    .eq("id", collabId)
    .maybeSingle();
  const c = collabRow as
    | {
        id: string;
        initiator_id: string;
        partner_id: string;
        status: "pending" | "verified" | "declined";
        project_name: string;
      }
    | null;
  if (!c) return { error: "Collaboration not found" };
  if (c.partner_id !== user.id) {
    return { error: "Only the tagged partner can verify this collaboration" };
  }
  if (c.status !== "pending") {
    return { error: "This collaboration has already been responded to" };
  }

  const newStatus = accept ? "verified" : "declined";
  const { error: updErr } = await supabase
    .from("collaborations")
    .update({ status: newStatus })
    .eq("id", collabId);
  if (updErr) return { error: updErr.message };

  if (accept) {
    await supabase.from("notifications").insert({
      user_id: c.initiator_id,
      actor_id: user.id,
      type: "collab_project_verified",
      collab_id: c.id,
    });

    // Both parties' verified-collab reputation just changed — bust cached
    // match reasons/intros involving either user.
    const [{ data: initP }, { data: partP }] = await Promise.all([
      supabase.from("profiles").select("username").eq("id", c.initiator_id).maybeSingle(),
      supabase.from("profiles").select("username").eq("id", c.partner_id).maybeSingle(),
    ]);
    const initRow = initP as { username: string } | null;
    const partRow = partP as { username: string } | null;
    if (initRow?.username) await invalidateUserAiCache(initRow.username);
    if (partRow?.username) await invalidateUserAiCache(partRow.username);
  }

  revalidatePath("/collabs");
  revalidatePath(`/u/${user.id}`);
  return { ok: true };
}

export async function revokeCollaboration(collabId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: collabRow } = await supabase
    .from("collaborations")
    .select("id, initiator_id")
    .eq("id", collabId)
    .maybeSingle();
  const c = collabRow as { id: string; initiator_id: string } | null;
  if (!c) return { error: "Collaboration not found" };
  if (c.initiator_id !== user.id) {
    return { error: "Only the initiator can revoke this collaboration" };
  }

  const { error: delErr } = await supabase
    .from("collaborations")
    .delete()
    .eq("id", collabId);
  if (delErr) return { error: delErr.message };

  revalidatePath("/collabs");
  return { ok: true };
}

// ---------- Proof of Work ----------

export async function createProofOfWork(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const media_url = String(formData.get("media_url") || "").trim();
  const media_type =
    String(formData.get("media_type") || "").trim() === "video"
      ? "video"
      : "image";
  const caption = String(formData.get("caption") || "");

  const project_title = String(formData.get("project_title") || "").trim();
  const work_type = String(formData.get("work_type") || "other").trim();
  const stage = String(formData.get("stage") || "in_progress").trim();
  const intent = String(formData.get("intent") || "").trim() || null;

  const tools = splitTags(formData.get("tools"));
  const skills = splitTags(formData.get("skills"), { lower: true });

  const timeStr = String(formData.get("time_spent_hours") || "").trim();
  const time_spent_hours = timeStr ? Number(timeStr) : null;

  const started_at =
    String(formData.get("started_at") || "").trim() || null;
  const industry = String(formData.get("industry") || "").trim() || null;
  const target_audience =
    String(formData.get("target_audience") || "").trim() || null;
  const use_case = String(formData.get("use_case") || "").trim() || null;
  const problem_solved =
    String(formData.get("problem_solved") || "").trim() || null;
  const key_decisions =
    String(formData.get("key_decisions") || "").trim() || null;
  const challenges = String(formData.get("challenges") || "").trim() || null;

  if (!media_url) return { error: "Please upload a photo or video first" };
  if (!project_title) return { error: "Project title is required" };

  // 1) Insert the post as a proof_of_work kind
  const { data: inserted, error: insErr } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      image_url: media_url,
      caption,
      media_type,
      kind: "proof_of_work",
    })
    .select("id")
    .single();
  if (insErr || !inserted) {
    return { error: insErr?.message ?? "Could not create post" };
  }

  // 2) Insert the PoW metadata row (1:1 with the post)
  const { error: metaErr } = await supabase.from("proof_of_work_meta").insert({
    post_id: inserted.id,
    project_title,
    work_type,
    stage,
    intent,
    tools,
    skills,
    time_spent_hours,
    started_at,
    industry,
    target_audience,
    use_case,
    problem_solved,
    key_decisions,
    challenges,
  });
  if (metaErr) {
    // Roll back the post so we don't leave a dangling row
    await supabase.from("posts").delete().eq("id", inserted.id);
    return { error: metaErr.message };
  }

  // Collab Lock (per-post invites — legacy path kept working for old composer)
  const collabRaw = String(formData.get("collaborators") || "").trim();
  if (collabRaw) {
    const invitees = parseCollabTokens(collabRaw);
    if (invitees.length > 0) {
      await inviteCollaborators(inserted.id, invitees);
    }
  }

  // New PoW post updates this user's skills/industries surface area, so any
  // cached match reasons/intros involving them are now stale.
  const { data: me } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.username) await invalidateUserAiCache(me.username);

  revalidatePath("/proof");
  redirect("/proof");
}

function splitTags(
  input: FormDataEntryValue | null,
  opts: { lower?: boolean } = {},
): string[] {
  const raw = String(input ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const out = opts.lower ? raw.map((s) => s.toLowerCase()) : raw;
  return Array.from(new Set(out));
}

/**
 * Parse the collaborators textarea value from the PoW composer. Accepts
 * comma- or newline-separated tokens like:
 *   "@alice", "@bob (design)", "carol (engineering)"
 * The leading @ is optional; the parenthesised suffix is captured as `role`.
 */
function parseCollabTokens(
  raw: string,
): Array<{ username: string; role: string | null }> {
  const tokens = raw
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const out: Array<{ username: string; role: string | null }> = [];
  const seen = new Set<string>();
  for (const t of tokens) {
    const m = t.match(/^@?([a-zA-Z0-9_]+)(?:\s*\(([^)]+)\))?\s*$/);
    if (!m) continue;
    const username = m[1].toLowerCase();
    if (seen.has(username)) continue;
    seen.add(username);
    out.push({ username, role: m[2]?.trim() || null });
  }
  return out;
}

// ---------- Follows ----------

export async function toggleFollow(targetId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === targetId) return { error: "Invalid" };

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetId)
    .maybeSingle();

  if (existing) {
    await supabase.from("follows").delete().eq("id", existing.id);
  } else {
    await supabase.from("follows").insert({ follower_id: user.id, following_id: targetId });
    await supabase.from("notifications").insert({
      user_id: targetId,
      actor_id: user.id,
      type: "follow",
    });
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- Messages ----------

export async function sendMessage(
  receiverId: string,
  payload: string | { content?: string; media_url?: string; media_type?: "image" | "audio" | "sticker" },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const data =
    typeof payload === "string" ? { content: payload } : payload;

  const content = (data.content ?? "").trim();
  const media_url = data.media_url ?? null;
  const media_type = data.media_type ?? null;

  if (!content && !media_url) return;

  await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content: content || null,
    media_url,
    media_type,
  });
  revalidatePath(`/messages/${receiverId}`);
}

export async function markMessagesRead(peerId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("receiver_id", user.id)
    .eq("sender_id", peerId)
    .eq("is_read", false);
}

// ---------- Profile ----------

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const updates = {
    full_name: String(formData.get("full_name") || ""),
    username: String(formData.get("username") || "").toLowerCase().trim(),
    website: String(formData.get("website") || ""),
    bio: String(formData.get("bio") || ""),
    gender: String(formData.get("gender") || ""),
    cover_url: String(formData.get("cover_url") || "").trim() || null,
    theme_color: String(formData.get("theme_color") || "#f72585"),
    updated_at: new Date().toISOString(),
  };

  const avatarUrl = String(formData.get("avatar_url") || "").trim();
  if (avatarUrl) {
    (updates as Record<string, unknown>).avatar_url = avatarUrl;
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) {
    console.error("[updateProfile] db update failed:", error);
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function createStory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const preUrl = String(formData.get("media_url") || "").trim();
  const preType = String(formData.get("media_type") || "").trim();
  const overlayText = String(formData.get("overlay_text") || "").trim() || null;
  const overlayColor =
    String(formData.get("overlay_color") || "").trim() || "#ffffff";
  const audioUrl = String(formData.get("audio_url") || "").trim() || null;

  if (preUrl) {
    const media_type = preType === "video" ? "video" : "image";
    const { error: insErr } = await supabase
      .from("stories")
      .insert({
        user_id: user.id,
        image_url: preUrl,
        media_type,
        overlay_text: overlayText,
        overlay_color: overlayColor,
        audio_url: audioUrl,
      });
    if (insErr) return { error: insErr.message };
    redirect("/feed");
  }

  // Legacy raw-file path (images only).
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return { error: "Select a photo or video" };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage.from("stories").upload(path, buf, {
    contentType: file.type || "image/jpeg",
  });
  if (upErr) return { error: upErr.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("stories").getPublicUrl(path);
  await supabase.from("stories").insert({
    user_id: user.id,
    image_url: publicUrl,
    media_type: "image",
    overlay_text: overlayText,
    overlay_color: overlayColor,
    audio_url: audioUrl,
  });
  redirect("/feed");
}
