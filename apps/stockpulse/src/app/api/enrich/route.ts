import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 30


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)


async function fetchGrowwSlug(ticker: string, fullName?: string | null): Promise<string | null> {
  try {
    const symbol = ticker.split('.')[0]
    const query = encodeURIComponent(`${symbol} ETF`)
    const res = await fetch(`https://groww.in/v1/api/search/v1/entity?q=${query}&size=3`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    if (!res.ok) {
      console.error(`Groww Search API failed for ${symbol}: ${res.status}`)
      return null
    }
    const data = await res.json()

    const etfResult = data?.content?.find((c: any) =>
      c?.id?.toLowerCase().includes('-etf') ||
      c?.title?.toLowerCase().includes('etf')
    ) || data?.content?.[0]

    const id = etfResult?.id || null
    if (id) console.log(`Groww Search: Found ID ${id} for ${symbol}`)
    return id
  } catch (err) {
    console.error(`Groww Search Error for ${ticker}:`, err)
    return null
  }
}


function generateGrowwSlugs(ticker: string, name?: string | null): string[] {
  const slugs: string[] = []

  if (name) {
    const nameSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '')
      .replace(/^-+/, '')
    if (nameSlug) slugs.push(nameSlug)
    if (!nameSlug.endsWith('-etf')) slugs.push(`${nameSlug}-etf`)
  }

  const tickerSymbol = ticker.replace('.NS', '').replace('.BO', '').toLowerCase()
  slugs.push(tickerSymbol)
  slugs.push(`${tickerSymbol}-etf`)

  return [...new Set(slugs)]
}

async function fetchFromGroww(slug: string): Promise<{ expenseRatio: number | null; aumCr: number | null } | null> {
  try {
    const res = await fetch(`https://groww.in/etfs/${slug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 0 }
    })

    if (!res.ok) {
      console.log(`Fetch for slug ${slug} failed with status: ${res.status}`)
      return null
    }
    const html = await res.text()

    let expenseRatio: number | null = null
    let aumCr: number | null = null

    const erMatch = html.match(/Expense ratio<\/div><div class="bodyBaseHeavy">([\d.]+)%<\/div>/i)
    if (erMatch) {
      expenseRatio = parseFloat(erMatch[1])
      console.log(`Found ER in HTML for ${slug}: ${expenseRatio}`)
    }

    const aumRegex = /(?:AUM|Asset under management|Fund size|Net assets)<\/div><div[^>]*>₹\s*([\d,.]+)(?:\s*Cr)?<\/div>/i
    const aumMatch = html.match(aumRegex)
    if (aumMatch) {
      aumCr = parseFloat(aumMatch[1].replace(/,/g, ''))
      console.log(`Found AUM in HTML for ${slug}: ${aumCr}`)
    }

    if (expenseRatio === null || aumCr === null) {
      const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/) ||
        html.match(/<script type="application\/json" id="__NEXT_DATA__">(.*?)<\/script>/)

      if (match) {
        try {
          const nextData = JSON.parse(match[1])

          const fundamentals = nextData?.props?.pageProps?.etfDetails?.fundamentals ||
            nextData?.props?.pageProps?.fundDetails?.fundamentals ||
            nextData?.props?.pageProps?.stockDetails?.fundamentals;

          if (fundamentals) {
            if (expenseRatio === null && fundamentals.expenseRatio !== undefined) expenseRatio = parseFloat(String(fundamentals.expenseRatio))
            if (aumCr === null && (fundamentals.aum !== undefined || fundamentals.aumAmount !== undefined)) {
              aumCr = parseFloat(String(fundamentals.aum || fundamentals.aumAmount))
            }
          }

          if (expenseRatio === null || aumCr === null) {
            function findValues(obj: any, depth = 0): void {
              if (!obj || typeof obj !== 'object' || depth > 12) return
              for (const key of Object.keys(obj)) {
                const val = obj[key]
                const lKey = key.toLowerCase()

                if (expenseRatio === null && (lKey === 'expenseratio' || lKey === 'ter')) {
                  const num = parseFloat(String(val))
                  if (!isNaN(num) && num > 0 && num < 5) expenseRatio = num
                }
                if (aumCr === null && (lKey === 'aum' || lKey === 'fundsize' || lKey === 'aumamount')) {
                  let num = parseFloat(String(val))
                  if (!isNaN(num) && num > 0) {
                    if (num > 1000000) num = num / 10000000
                    aumCr = num
                  }
                }
                if (typeof val === 'object' && val !== null) findValues(val, depth + 1)
              }
            }
            findValues(nextData)
          }
        } catch (e) {
          console.error('Failed to parse NEXT_DATA JSON', e)
        }
      }
    }

    if (expenseRatio === null && aumCr === null) return null
    return { expenseRatio, aumCr }
  } catch (err) {
    console.error('Error in fetchFromGroww:', err)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker')
  const name = searchParams.get('name')
  const type = searchParams.get('type')
  const force = searchParams.get('force') === 'true'

  if (!ticker) return NextResponse.json({ error: 'ticker required' }, { status: 400 })

  if (type === 'EQUITY') {
    return NextResponse.json({ ticker, skipped: true })
  }

  const { data: cached } = await supabase.from('etf_metadata').select('*').eq('ticker', ticker).single()
  if (!force && cached?.last_fetched && cached.expense_ratio !== null) {
    const age = Date.now() - new Date(cached.last_fetched).getTime()
    if (age < 3 * 24 * 60 * 60 * 1000) return NextResponse.json({ cached: true, ...cached })
  }

  let result = null
  const searchSlug = await fetchGrowwSlug(ticker)
  if (searchSlug) {
    result = await fetchFromGroww(searchSlug)
  }

  if (!result) {
    const slugs = generateGrowwSlugs(ticker, name)
    for (const slug of slugs) {
      if (slug === searchSlug) continue
      result = await fetchFromGroww(slug)
      if (result) break
    }
  }

  const { expenseRatio, aumCr } = result || { expenseRatio: null, aumCr: null }
  await supabase.from('etf_metadata').upsert({
    ticker,
    expense_ratio: expenseRatio,
    aum_cr: aumCr,
    data_source: result ? 'groww' : 'failed',
    last_fetched: new Date().toISOString(),
  })

  return NextResponse.json({ ticker, expenseRatio, aumCr, cached: false })
}
