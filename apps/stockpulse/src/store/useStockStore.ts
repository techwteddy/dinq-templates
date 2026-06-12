import { create } from 'zustand';
import { StockData } from '@/lib/spreadsheet';

interface StockState {
  stocks: StockData[];
  lastUpdated: Date;
  selectedTicker: string | null;
  watchlist: string[];

  // Actions
  setStocks: (stocks: StockData[]) => void;
  setSelectedTicker: (ticker: string | null) => void;
  setLastUpdated: (date: Date) => void;
  toggleWatchlist: (ticker: string) => void;
}

export const useStockStore = create<StockState>((set) => ({
  stocks: [],
  lastUpdated: new Date(),
  selectedTicker: null,
  watchlist: [],

  setStocks: (stocks) => set({ stocks }),
  setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
  toggleWatchlist: (ticker) => set((state) => ({
    watchlist: state.watchlist.includes(ticker)
      ? state.watchlist.filter(t => t !== ticker)
      : [...state.watchlist, ticker]
  })),
}));
