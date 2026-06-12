import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, useCallback } from "react"

const supabase = createClient()

export function useUserEtfs() {
  const [userEtfs, setUserEtfs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEtfs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from("user_etfs")
      .select("ticker")
      .eq("user_id", user.id)

    setUserEtfs(data?.map(r => r.ticker) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchEtfs() }, [fetchEtfs])

  const addEtf = useCallback(async (
    ticker: string,
    fullName: string,
    sector: string,
    company: string,
    assetType: 'ETF' | 'EQUITY' = 'ETF'
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("user_etfs").upsert({
      user_id: user.id, ticker, full_name: fullName, sector, company
    })
    setUserEtfs(prev => [...new Set([...prev, ticker])])

    if (assetType === 'ETF') {
      fetch(`/api/enrich?ticker=${encodeURIComponent(ticker)}&name=${encodeURIComponent(fullName)}&type=ETF`).catch(() => {})
    }
  }, [])

  const removeEtf = useCallback(async (ticker: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("user_etfs").delete()
      .eq("user_id", user.id).eq("ticker", ticker)
    setUserEtfs(prev => prev.filter(t => t !== ticker))
  }, [])

  return { userEtfs, loading, addEtf, removeEtf, refetch: fetchEtfs }
}

export function useUserFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  const fetchFavorites = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("user_favorites")
      .select("ticker")
      .eq("user_id", user.id)

    setFavorites(data?.map(r => r.ticker) || [])
  }, [])

  useEffect(() => { fetchFavorites() }, [fetchFavorites])

  const toggleFavorite = useCallback(async (ticker: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const isFav = favorites.includes(ticker)
    if (isFav) {
      await supabase.from("user_favorites").delete()
        .eq("user_id", user.id).eq("ticker", ticker)
      setFavorites(prev => prev.filter(t => t !== ticker))
    } else {
      await supabase.from("user_favorites").upsert({ user_id: user.id, ticker })
      setFavorites(prev => [...prev, ticker])
    }
  }, [favorites])

  return { favorites, toggleFavorite, refetch: fetchFavorites }
}

export function useEtfMetadata(ticker: string | null) {
  const [metadata, setMetadata] = useState<{ expense_ratio: number | null; aum_cr: number | null } | null>(null)

  useEffect(() => {
    if (!ticker) return
    supabase.from("etf_metadata").select("expense_ratio, aum_cr")
      .eq("ticker", ticker).single()
      .then(({ data }) => setMetadata(data))
  }, [ticker])

  return metadata
}
