export const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Completed',
  'Cancelled',
] as const;

export const ORDER_STATUS_OPTIONS = [
  'New',
  'In Progress',
  'Ready to Ship',
  'Shipped',
  'Delivered',
  'Returned',
] as const;

export const SOURCE_OPTIONS = [
  'Website',
  'Instagram',
  'Facebook',
  'WhatsApp',
  'Referral',
  'Walk-in',
  'Exhibition',
  'Other',
] as const;

export const PAYMENT_TYPE_OPTIONS = [
  'Cash',
  'Card',
  'Bank Transfer',
  'UPI',
  'PayPal',
  'Credit',
  'Other',
] as const;

export const COUNTRY_OPTIONS = [
  'India',
  'USA',
  'UK',
  'UAE',
  'Canada',
  'Australia',
  'Singapore',
  'Germany',
  'France',
  'Other',
] as const;

export const YES_NO_OPTIONS = ['Yes', 'No'] as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
} as const;