import { Activity, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { HealthStatus } from '@/types';

/**
 * Props for the StatusBadge component.
 */
export interface StatusBadgeProps {
  /** The health status to display */
  status: HealthStatus;
}

/**
 * StatusBadge component that displays a colored icon and label based on health status.
 *
 * Color coding:
 * - healthy: Green with checkmark
 * - degraded: Yellow/Orange with warning triangle
 * - down: Red with X mark
 * - unknown: Gray with help circle
 *
 * @param props - Component props containing the status
 * @returns React component displaying the status badge
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    healthy: {
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: CheckCircle2,
      label: 'Healthy',
    },
    degraded: {
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      icon: AlertTriangle,
      label: 'Degraded',
    },
    down: {
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: XCircle,
      label: 'Down',
    },
    unknown: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800/30',
      borderColor: 'border-gray-200 dark:border-gray-700',
      icon: HelpCircle,
      label: 'Unknown',
    },
  };

  const { color, bgColor, borderColor, icon: Icon, label } = config[status] || config.unknown;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${bgColor} ${borderColor}`}
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <span className={`text-sm font-medium ${color}`}>{label}</span>
    </div>
  );
}
