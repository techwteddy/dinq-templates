import { Clock, Zap, Globe, AlertCircle } from 'lucide-react';
import { HealthCheckResult } from '@/types';
import StatusBadge from './StatusBadge';
import { formatRelativeTime, formatDuration } from '@/utils';

/**
 * Props for the EnvironmentCard component.
 */
export interface EnvironmentCardProps {
  /** Health check result for this environment */
  result: HealthCheckResult;
}

/**
 * EnvironmentCard component displays a card with environment health information.
 *
 * Shows:
 * - Environment name and URL
 * - Current status badge (healthy/degraded/down)
 * - Latest latency
 * - Time of last check
 * - Error message if applicable
 *
 * @param props - Component props containing the health check result
 * @returns React component displaying the environment card
 */
export default function EnvironmentCard({ result }: EnvironmentCardProps) {
  const { envName, url, status, latencyMs, timestamp, error } = result;

  // Border color based on status
  const borderColor = {
    healthy: 'border-l-green-500',
    degraded: 'border-l-yellow-500',
    down: 'border-l-red-500',
    unknown: 'border-l-gray-400',
  }[status];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 ${borderColor} p-5 transition-all hover:shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {envName}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate" title={url}>
              {url}
            </span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Latency */}
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Latency</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDuration(latencyMs)}
            </p>
          </div>
        </div>

        {/* Last Checked */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Checked</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatRelativeTime(timestamp)}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400 break-all">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
