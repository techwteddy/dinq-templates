import { Activity, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '@/utils';

/**
 * Props for the Header component.
 */
export interface HeaderProps {
  /** Whether data is currently loading */
  loading: boolean;
  /** Timestamp of the last successful refresh */
  lastUpdated: Date | null;
  /** Callback function to trigger manual refresh */
  onRefresh: () => void;
}

/**
 * Header component for the dashboard.
 *
 * Displays:
 * - Dashboard title with activity icon
 * - Last updated time
 * - Manual refresh button
 *
 * @param props - Component props with loading state, last updated time, and refresh handler
 * @returns React component displaying the dashboard header
 */
export default function Header({ loading, lastUpdated, onRefresh }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Server Health Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Environment Health Monitoring
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Updated {formatRelativeTime(lastUpdated.toISOString())}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Refresh health check data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
