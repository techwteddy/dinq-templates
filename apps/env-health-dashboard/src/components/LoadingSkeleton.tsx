import { Loader2 } from 'lucide-react';

/**
 * LoadingSkeleton component displays a loading placeholder for environment cards.
 *
 * Shows animated skeleton placeholders that mimic the shape of the EnvironmentCard
 * component while data is being fetched.
 *
 * @returns React component displaying loading skeletons
 */
export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-l-gray-300 dark:border-l-gray-600 p-5 animate-pulse"
        >
          {/* Header skeleton */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
          </div>

          {/* Metrics skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ErrorMessage component displays an error state with optional retry button.
 *
 * @param props - Component props
 * @param props.message - Error message to display
 * @param props.onRetry - Optional callback function for retry button
 * @returns React component displaying the error message
 */
export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 max-w-md border border-red-200 dark:border-red-800">
        <Loader2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
          Failed to Load Data
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
