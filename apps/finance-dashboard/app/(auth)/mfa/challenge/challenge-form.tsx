"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ChallengeForm() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) return setError(error.message);
      const verified = data.totp.find((f) => f.status === "verified");
      if (!verified) {
        router.replace("/mfa/enroll");
        return;
      }
      setFactorId(verified.id);
    }
    void load();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setLoading(true);
    const supabase = createClient();
    const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId });
    if (chErr || !ch) {
      setLoading(false);
      toast.error(chErr?.message ?? "Failed to start challenge.");
      return;
    }
    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId: ch.id, code });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  async function onLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (error) return <p className="text-destructive text-sm">{error}</p>;
  if (!factorId) return <p className="text-muted-foreground text-sm">Loading factor…</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          autoComplete="one-time-code"
          autoFocus
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading || code.length !== 6} className="flex-1">
          {loading ? "Verifying…" : "Verify"}
        </Button>
        <Button type="button" variant="ghost" onClick={onLogout}>
          Sign out
        </Button>
      </div>
    </form>
  );
}
