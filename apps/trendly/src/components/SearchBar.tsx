"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { avatarFor } from "@/lib/utils";

type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

type Props = {
  /** Where a result links to. 'profile' = /u/<username>, 'message' = /messages/<id>. Default 'profile'. */
  linkTo?: "profile" | "message";
  placeholder?: string;
  excludeSelfId?: string;
};

export function SearchBar({ linkTo = "profile", placeholder = "Search", excludeSelfId }: Props = {}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const term = q.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      let query = supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .or(`username.ilike.%${term}%,full_name.ilike.%${term}%`)
        .limit(20);
      if (excludeSelfId) query = query.neq("id", excludeSelfId);
      const { data } = await query;
      setResults((data ?? []) as Profile[]);
      setLoading(false);
    }, 200);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [q, supabase]);

  const showResults = focused && q.trim().length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 h-10 rounded-lg bg-[color:var(--color-bg-elev)] px-3">
        <SearchIcon size={16} className="text-white/60" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/60"
          autoComplete="off"
          spellCheck={false}
        />
        {q && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setQ("")}
            className="text-white/60 hover:text-white"
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showResults && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute left-0 right-0 top-12 bg-black border border-[color:var(--color-border)] rounded-lg overflow-hidden shadow-lg z-30 max-h-[60vh] overflow-y-auto"
        >
          {loading && (
            <div className="px-3 py-3 text-sm text-white/60">Searching…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-3 py-3 text-sm text-white/60">No results</div>
          )}
          {!loading &&
            results.map((p) => (
              <Link
                key={p.id}
                href={linkTo === "message" ? `/messages/${p.id}` : `/u/${p.username}`}
                onClick={() => {
                  setQ("");
                  setResults([]);
                  setFocused(false);
                }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-white/5"
              >
                <span className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={avatarFor(p.username, p.avatar_url)}
                    alt={p.username}
                    width={36}
                    height={36}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold truncate">
                    {p.username}
                  </span>
                  {p.full_name && (
                    <span className="block text-xs text-white/60 truncate">
                      {p.full_name}
                    </span>
                  )}
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
