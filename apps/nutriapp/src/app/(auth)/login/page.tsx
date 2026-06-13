"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/db/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Email y contraseña requeridos");
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError("Credenciales incorrectas");
      } else {
        router.refresh();
        router.push("/");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-12">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-muted border border-accent/30 mb-4">
          <span className="text-2xl">◎</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">
          NutriApp
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Tu app de nutrición privada
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && (
          <p className="text-sm text-danger text-center">{error}</p>
        )}

        <Button
          onClick={handleLogin}
          loading={loading}
          fullWidth
          size="lg"
        >
          Entrar
        </Button>
      </div>

      <p className="text-center text-xs text-ink-muted mt-8">
        App de uso personal. Sin registro público.
      </p>
    </div>
  );
}
