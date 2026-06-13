import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/app/actions";
import { AvatarPicker } from "@/components/AvatarPicker";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  return (
    <>
      <header className="h-12 px-3 flex items-center justify-between border-b border-[color:var(--color-border)]">
        <Link href="/profile" className="text-base">Cancel</Link>
        <span className="font-semibold">Edit Profile</span>
        <button form="edit-profile-form" type="submit" className="text-[color:var(--color-primary)] font-semibold">
          Done
        </button>
      </header>

      <form id="edit-profile-form" action={updateProfile} className="px-6 py-4 flex flex-col gap-5">
        <AvatarPicker username={p!.username} currentAvatarUrl={p!.avatar_url} userId={user!.id} />

        {[
          { k: "full_name", label: "Name", value: p?.full_name ?? "" },
          { k: "username", label: "Username", value: p?.username ?? "" },
          { k: "website", label: "Website", value: p?.website ?? "" },
        ].map((f) => (
          <div key={f.k} className="flex items-center gap-4 border-b border-[color:var(--color-border)] pb-3">
            <label className="w-20 text-sm text-white/70">{f.label}</label>
            <input
              name={f.k}
              defaultValue={f.value}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        ))}

        <div className="flex items-start gap-4 border-b border-[color:var(--color-border)] pb-3">
          <label className="w-20 text-sm text-white/70 pt-1">Bio</label>
          <textarea
            name="bio"
            defaultValue={p?.bio ?? ""}
            rows={3}
            className="flex-1 bg-transparent outline-none text-sm resize-none"
          />
        </div>

        {/* Cover image URL field. */}
        <div className="flex items-start gap-4 border-b border-[color:var(--color-border)] pb-3">
          <label className="w-20 text-sm text-white/70 pt-1">Cover</label>
          <input
            name="cover_url"
            defaultValue={(p as { cover_url?: string | null })?.cover_url ?? ""}
            placeholder="https://image.url/banner.jpg"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        {/* Accent color picker. */}
        <div className="flex items-start gap-4 border-b border-[color:var(--color-border)] pb-3">
          <label className="w-20 text-sm text-white/70 pt-1">Accent</label>
          <div className="flex-1 flex flex-wrap gap-2">
            {["#f72585","#ff7a45","#7209b7","#22c55e","#3b82f6","#facc15"].map((c) => (
              <label key={c} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme_color"
                  value={c}
                  defaultChecked={((p as { theme_color?: string | null })?.theme_color ?? "#f72585") === c}
                  className="sr-only peer"
                />
                <span
                  className="w-7 h-7 rounded-full border-2 border-white/20 peer-checked:border-white"
                  style={{ backgroundColor: c }}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="text-[color:var(--color-primary)] text-sm font-semibold">Switch to Professional Account</div>

        <h3 className="text-sm font-semibold mt-2">Private Information</h3>

        <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] pb-3">
          <label className="w-20 text-sm text-white/70">Email</label>
          <span className="flex-1 text-sm text-white/80">{user!.email}</span>
        </div>

        <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] pb-3">
          <label className="w-20 text-sm text-white/70">Gender</label>
          <input
            name="gender"
            defaultValue={p?.gender ?? ""}
            placeholder="Prefer not to say"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </form>
    </>
  );
}
