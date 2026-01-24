export interface Customer {
  customer_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_country: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  order_id: string;
  order_date: string | null;
  total: number;
  invoice: string | null;
  status: string | null;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
  source: string | null;
  order_status: string | null;
  shipped: string | null;
  tracking_id_shared: string | null;
  delivered: string | null;
  payment_type: string | null;
  amount_received: number;
  tracking_id: string | null;
  amount_pending: number;
  remark: string | null;
  order_type: 'Sales order' | 'Quotation';
  customer?: Customer;
}

export interface SaleWithCustomer extends Sale {
  customers?: Customer | null;
}

export interface DashboardKPIs {
  totalSalesOrders: number;
  totalRevenue: number;
  totalPending: number;
  totalReceived: number;
  totalQuotations: number;
  totalQuotationValue: number;
  conversionRate: number;
  totalCustomers: number;
}

export interface SalesTrendData {
  period: string;
  revenue: number;
  orders: number;
}

export interface RevenueBySourceData {
  source: string;
  value: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
}

export interface TopCustomerData {
  customer_name: string;
  revenue: number;
}

export interface FilterState {
  search: string;
  status?: string[];
  order_status?: string[];
  source?: string[];
  payment_type?: string[];
  customer_country?: string[];
  date_from?: string;
  date_to?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}