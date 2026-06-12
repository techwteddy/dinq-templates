import { NextResponse, NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const rawQuery = encodeURIComponent(q.trim())

    const res = await fetch(`https://groww.in/v1/api/search/v1/entity?q=${rawQuery}&size=20`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!res.ok) throw new Error(`Groww Search failed: ${res.status}`)

    const data = await res.json()
    const content = data?.content || []

    const filtered = content
      .filter((r: any) => {
        const t = (r.entity_type || '').toUpperCase()
        return (t === 'ETF' || t === 'STOCKS' || t === 'STOCK') &&
          (r.nse_scrip_code || r.bse_scrip_code)
      })
      .slice(0, 10)
      .map((r: any) => {
        const t = (r.entity_type || '').toUpperCase()
        const ticker = (r.nse_scrip_code || r.bse_scrip_code) + (r.nse_scrip_code ? '.NS' : '.BO')
        return {
          symbol: ticker,
          longname: r.title,
          shortname: r.company_short_name || r.title,
          exchDisp: r.nse_scrip_code ? 'NSE' : 'BSE',
          quoteType: t === 'ETF' ? 'ETF' : 'EQUITY',
        }
      })

    return NextResponse.json({ results: filtered })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [] })
  }
}
