import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface CalloutProps {
  type?: 'default' | 'warning' | 'danger' | 'success' | 'info';
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const icons = {
  default: Info,
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
  success: CheckCircle,
};

export function Callout({
  type = 'default',
  title,
  children,
  className,
}: CalloutProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        'my-6 flex items-start gap-3 rounded-lg border p-4 text-sm shadow-sm',
        {
          'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-200':
            type === 'info' || type === 'default',
          'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900/50 dark:bg-yellow-950/20 dark:text-yellow-200':
            type === 'warning',
          'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200':
            type === 'danger',
          'border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-200':
            type === 'success',
        },
        className
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1">
        {title && <div className="mb-1 font-semibold">{title}</div>}
        <div className="[&>p:last-child]:mb-0">{children}</div>
      </div>
    </div>
  );
}
