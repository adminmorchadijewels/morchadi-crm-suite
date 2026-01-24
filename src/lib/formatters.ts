import { format, parseISO } from 'date-fns';

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  try {
    return format(parseISO(date), 'dd MMM yyyy');
  } catch {
    return date;
  }
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '-';
  try {
    return format(parseISO(date), 'dd MMM yyyy, HH:mm');
  } catch {
    return date;
  }
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(1)}%`;
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateCustomerId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CUS-${timestamp}-${random}`;
}