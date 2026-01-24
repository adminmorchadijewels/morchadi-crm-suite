import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string | null | undefined;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const statusVariants: Record<string, StatusBadgeProps['variant']> = {
  // Order status
  'Completed': 'success',
  'Delivered': 'success',
  'Confirmed': 'success',
  'Shipped': 'info',
  'In Progress': 'info',
  'Ready to Ship': 'info',
  'Processing': 'warning',
  'Pending': 'warning',
  'New': 'default',
  'Cancelled': 'error',
  'Returned': 'error',
  // Yes/No
  'Yes': 'success',
  'No': 'default',
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const displayStatus = status || 'Unknown';
  const resolvedVariant = variant || statusVariants[displayStatus] || 'default';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
    info: 'bg-primary-50 text-primary-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[resolvedVariant]
      )}
    >
      {displayStatus}
    </span>
  );
}