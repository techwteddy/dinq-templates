import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { ticker, expense_ratio, aum_cr } = await request.json()

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('etf_metadata')
      .upsert({
        ticker,
        expense_ratio: expense_ratio !== undefined ? expense_ratio : null,
        aum_cr: aum_cr !== undefined ? aum_cr : null,
        data_source: 'manual',
        last_fetched: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Metadata update route error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
