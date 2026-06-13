import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { TrendlyLogo } from "@/components/TrendlyLogo";
import { WelcomeCarousel } from "@/components/WelcomeCarousel";
import { avatarFor } from "@/lib/utils";

export default async function SwitchAccountsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <WelcomeCarousel />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
      <TrendlyLogo size={52} />
      {profile && (
        <>
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/20">
            <Image
              src={avatarFor(profile.username, profile.avatar_url)}
              alt={profile.username}
              width={96}
              height={96}
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="text-lg">{profile.username}</div>
          <Link
            href="/feed"
            className="w-full max-w-sm h-12 btn-primary flex items-center justify-center font-semibold"
          >
            Log in
          </Link>
          <Link href="/login" className="text-[color:var(--color-primary)] font-semibold">
            Switch accounts
          </Link>
        </>
      )}
      <p className="mt-auto text-white/60 text-sm pb-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-white font-semibold">
          Sign up.
        </Link>
      </p>
    </div>
  );
}
