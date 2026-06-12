"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/lib/constants";

type Factor = { id: string; qr: string; secret: string };

export function EnrollForm() {
  const router = useRouter();
  const [factor, setFactor] = useState<Factor | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void bootstrap();
    async function bootstrap() {
      const supabase = createClient();
      const existing = await supabase.auth.mfa.listFactors();
      const unverified = existing.data?.all.find((f) => f.factor_type === "totp" && f.status === "unverified");
      if (unverified) {
        await supabase.auth.mfa.unenroll({ factorId: unverified.id }).catch(() => undefined);
      }
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: APP_NAME });
      if (error) {
        setError(error.message);
        return;
      }
      setFactor({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    }
  }, []);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!factor) return;
    setLoading(true);
    const supabase = createClient();
    const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId: factor.id });
    if (chErr || !ch) {
      setLoading(false);
      toast.error(chErr?.message ?? "Failed to create challenge.");
      return;
    }
    const { error } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: ch.id, code });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.from("profiles").update({ mfa_enrolled_at: new Date().toISOString() }).eq("id", (await supabase.auth.getUser()).data.user!.id);
    toast.success("MFA configured. Welcome.");
    router.replace("/");
    router.refresh();
  }

  if (error) return <p className="text-destructive text-sm">{error}</p>;
  if (!factor) return <p className="text-muted-foreground text-sm">Generating key…</p>;

  return (
    <form onSubmit={onVerify} className="space-y-4">
      <div className="flex flex-col items-center gap-3 p-4 bg-muted/40 rounded-lg">
        <div
          className="[&_svg]:w-48 [&_svg]:h-48"
          dangerouslySetInnerHTML={{ __html: factor.qr }}
        />
        <p className="text-xs text-muted-foreground text-center">
          Or enter manually: <code className="text-foreground font-mono">{factor.secret}</code>
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">6-digit code</Label>
        <Input
          id="code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          autoComplete="one-time-code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
        {loading ? "Verifying…" : "Enable MFA"}
      </Button>
    </form>
  );
}
