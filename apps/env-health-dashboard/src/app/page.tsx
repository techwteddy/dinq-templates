'use client';

import { Header, EnvironmentCard, LoadingSkeleton, ErrorMessage } from '@/components';
import { useHealthCheck } from '@/hooks/useHealthCheck';

/**
 * HomePage - Main dashboard for the Server Environment Health Monitor.
 *
 * This component:
 * - Uses the useHealthCheck hook to poll the API
 * - Displays a header with refresh controls
 * - Shows a grid of EnvironmentCard components
 * - Handles loading and error states gracefully
 *
 * @returns React component displaying the complete dashboard
 */
export default function Home() {
  const { results, loading, error, lastUpdated, refresh } = useHealthCheck();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header loading={loading} lastUpdated={lastUpdated} onRefresh={refresh} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && results.length === 0 && <LoadingSkeleton />}

        {/* Error State */}
        {error && !loading && <ErrorMessage message={error} onRetry={refresh} />}

        {/* Results Grid */}
        {!error && results.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Total Environments"
                value={results.length}
                color="text-gray-900 dark:text-white"
              />
              <StatCard
                label="Healthy"
                value={results.filter((r) => r.status === 'healthy').length}
                color="text-green-600 dark:text-green-400"
              />
              <StatCard
                label="Degraded"
                value={results.filter((r) => r.status === 'degraded').length}
                color="text-yellow-600 dark:text-yellow-400"
              />
              <StatCard
                label="Down"
                value={results.filter((r) => r.status === 'down').length}
                color="text-red-600 dark:text-red-400"
              />
            </div>

            {/* Environment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <EnvironmentCard key={result.envName} result={result} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No environments configured. Set TARGET_ENVIRONMENTS in your .env file.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * StatCard displays a single summary statistic.
 *
 * @param props - Component props
 * @param props.label - Label for the statistic
 * @param props.value - Value to display
 * @param props.color - Tailwind CSS color class for the value
 * @returns React component displaying a stat card
 */
function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
