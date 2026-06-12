import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export interface StockData {
  ticker: string;
  price: number;
  change1d: number;
  change30d: number;
  volume: number;
  tradedValue: number;
  category: string;
  company: string;
  sector: string;
  fullName: string;
  assetType: 'ETF' | 'EQUITY';
  dayHigh: number;
  dayLow: number;
  aum: number | null;
  expenseRatio: number | null;
  volatility: string | null;
}

export interface AssetConfig {
  ticker: string;
  fullName: string;
  sector: string;
  company: string;
  category?: string;
}

let historical30dCache: Record<string, number> = {};
let lastCacheUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 12;

async function get30DayAgoPrices(symbols: string[]) {
  const now = Date.now();
  if (now - lastCacheUpdate < CACHE_DURATION && Object.keys(historical30dCache).length > 0) {
    return historical30dCache;
  }

  const today = new Date();
  const thirtyFiveDaysAgo = new Date(today);
  thirtyFiveDaysAgo.setDate(today.getDate() - 35);

  const twentyFiveDaysAgo = new Date(today);
  twentyFiveDaysAgo.setDate(today.getDate() - 25);

  const CHUNK_SIZE = 20;
  for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
    const chunk = symbols.slice(i, i + CHUNK_SIZE);
    await Promise.all(chunk.map(async (symbol) => {
      try {
        const history = await yahooFinance.historical(symbol, {
          period1: thirtyFiveDaysAgo,
          period2: twentyFiveDaysAgo,
          interval: '1d'
        });

        if (history && history.length > 0) {
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() - 30);

          let closestEntry = history[0];
          let minDiff = Math.abs(history[0].date.getTime() - targetDate.getTime());

          for (const entry of history) {
            const diff = Math.abs(entry.date.getTime() - targetDate.getTime());
            if (diff < minDiff) {
              minDiff = diff;
              closestEntry = entry;
            }
          }

          historical30dCache[symbol] = closestEntry.adjClose || closestEntry.close;
        }
      } catch {
        // skip unavailable
      }
    }));
  }

  lastCacheUpdate = now;
  return historical30dCache;
}

export async function fetchHistoricalChartData(symbol: string, range: string = '1mo', interval: string = '1d') {
  try {
    const period2 = new Date();
    let period1 = new Date();

    switch (range) {
      case '1d': period1.setDate(period2.getDate() - 1); break;
      case '5d': period1.setDate(period2.getDate() - 5); break;
      case '1mo': period1.setMonth(period2.getMonth() - 1); break;
      case '6mo': period1.setMonth(period2.getMonth() - 6); break;
      case '1y': period1.setFullYear(period2.getFullYear() - 1); break;
      default: period1.setMonth(period2.getMonth() - 1);
    }

    const result = await (yahooFinance as any).chart(symbol, {
      period1,
      period2,
      interval: interval as any
    });

    if (!result || !result.quotes) return { quotes: [], meta: null };

    const quotes = result.quotes.map((q: any) => ({
      time: (new Date(q.date).getTime() / 1000) as any,
      open: q.open || 0,
      high: q.high || 0,
      low: q.low || 0,
      close: q.close || 0,
      value: q.close || 0,
    })).filter((q: any) => q.open !== 0);

    return { quotes, meta: result.meta };
  } catch (error) {
    console.error(`fetchHistoricalChartData failed for ${symbol}:`, error);
    return { quotes: [], meta: null };
  }
}

export async function fetchEtfDetails(symbol: string) {
  try {
    const result = await yahooFinance.quoteSummary(symbol, { modules: ['fundProfile', 'summaryDetail'] });
    const ratio = result.fundProfile?.feesExpensesInvestment?.totalExpenseRatio;
    return {
      expenseRatio: typeof ratio === 'number' ? ratio * 100 : null,
      aum: result.summaryDetail?.totalAssets || null,
      beta: result.summaryDetail?.beta || null,
    };
  } catch {
    return { expenseRatio: null, aum: null, beta: null };
  }
}

function detectAssetType(fullName: string): 'ETF' | 'EQUITY' {
  const upper = fullName?.toUpperCase() || '';
  if (upper.includes('ETF') || upper.includes(' FUND')) return 'ETF';
  return 'EQUITY';
}

export async function fetchStockData(assets: AssetConfig[]): Promise<StockData[]> {
  try {
    if (!assets || assets.length === 0) return [];

    const symbols = assets.map(s => s.ticker);

    const [quotes, historyCache] = await Promise.all([
      yahooFinance.quote(symbols),
      get30DayAgoPrices(symbols)
    ]);

    const extraDetailsCache: Record<string, any> = {};
    const CHUNK_SIZE = 10;
    for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
      const chunk = symbols.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(async (symbol) => {
        const asset = assets.find(a => a.ticker === symbol);
        const assetType = detectAssetType(asset?.fullName || '');
        if (assetType === 'ETF') {
          extraDetailsCache[symbol] = await fetchEtfDetails(symbol);
        } else {
          extraDetailsCache[symbol] = { expenseRatio: null, aum: null, beta: null };
        }
      }));
    }

    return assets.map((asset): StockData | null => {
      const quote: any = Array.isArray(quotes)
        ? quotes.find(q => q.symbol === asset.ticker)
        : quotes;

      if (!quote) return null;

      const details = extraDetailsCache[asset.ticker] || {};
      const currentPrice = quote.regularMarketPrice || quote.price || 0;
      const price30DaysAgo = historyCache[asset.ticker];

      let change30d = 0;
      if (price30DaysAgo && price30DaysAgo > 0) {
        change30d = ((currentPrice - price30DaysAgo) / price30DaysAgo) * 100;
      }

      let volatility: string;
      if (details.beta == null) {
        volatility = 'N/A';
      } else if (details.beta < 0.8) {
        volatility = 'LOW';
      } else if (details.beta > 1.2) {
        volatility = 'HIGH';
      } else {
        volatility = 'MODERATE';
      }

      return {
        ticker: asset.ticker,
        price: currentPrice,
        change1d: quote.regularMarketChangePercent || 0,
        change30d,
        volume: quote.regularMarketVolume || 0,
        tradedValue: currentPrice * (quote.regularMarketVolume || 0),
        category: asset.category || 'ETF',
        company: asset.company,
        sector: asset.sector,
        fullName: asset.fullName,
        assetType: detectAssetType(asset.fullName),
        dayHigh: quote.regularMarketDayHigh || currentPrice,
        dayLow: quote.regularMarketDayLow || currentPrice,
        aum: details.aum || null,
        expenseRatio: details.expenseRatio || null,
        volatility,
      };
    }).filter((q): q is StockData => q !== null);
  } catch (error) {
    console.error('fetchStockData error:', error);
    return [];
  }
}

// Keep ETFConfig as alias for backwards compatibility
export type ETFConfig = AssetConfig;
