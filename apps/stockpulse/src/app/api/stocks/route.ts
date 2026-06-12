import { fetchStockData, fetchHistoricalChartData, fetchEtfDetails } from '@/lib/spreadsheet';
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }

    if (ticker) {
      if (searchParams.get('details') === 'true') {
        const details = await fetchEtfDetails(ticker);
        return NextResponse.json(details, { headers });
      }
      const range = searchParams.get('range') || '1mo';
      const interval = searchParams.get('interval') || '1d';
      const history = await fetchHistoricalChartData(ticker, range, interval);
      return NextResponse.json(history, { headers });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json([], { headers });
    }

    const { data: etfs, error } = await supabase
      .from('user_etfs')
      .select('ticker, full_name, sector, company')
      .eq('user_id', user.id);

    if (error || !etfs || etfs.length === 0) {
      return NextResponse.json([], { headers });
    }

    const etfConfigs = etfs.map(e => ({
      ticker: e.ticker,
      fullName: e.full_name,
      sector: e.sector,
      company: e.company,
      category: 'ETF'
    }));

    const data = await fetchStockData(etfConfigs);

    const { data: metadataList } = await supabase
      .from('etf_metadata')
      .select('ticker, expense_ratio, aum_cr')
      .in('ticker', etfs.map(e => e.ticker));

    const enrichedData = data.map(stock => {
      const metadata = (metadataList || []).find(m => m.ticker === stock.ticker);
      if (!metadata) return stock;

      return {
        ...stock,
        expenseRatio: metadata.expense_ratio ?? stock.expenseRatio,
        aum: metadata.aum_cr ? metadata.aum_cr * 10000000 : stock.aum,
      };
    });

    return NextResponse.json(enrichedData, { headers });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
