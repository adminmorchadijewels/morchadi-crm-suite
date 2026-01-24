import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  DashboardKPIs, 
  SalesTrendData, 
  RevenueBySourceData, 
  OrderStatusData, 
  TopCustomerData,
  SaleWithCustomer 
} from '@/types';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: async (): Promise<DashboardKPIs> => {
      // Fetch all sales data
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('order_type, total, amount_pending, amount_received');

      if (salesError) throw salesError;

      // Fetch customer count
      const { count: customerCount, error: customerError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (customerError) throw customerError;

      const salesOrders = salesData?.filter(s => s.order_type === 'Sales order') || [];
      const quotations = salesData?.filter(s => s.order_type === 'Quotation') || [];

      const totalRevenue = salesOrders.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
      const totalPending = salesOrders.reduce((sum, s) => sum + (Number(s.amount_pending) || 0), 0);
      const totalReceived = salesOrders.reduce((sum, s) => sum + (Number(s.amount_received) || 0), 0);
      const totalQuotationValue = quotations.reduce((sum, s) => sum + (Number(s.total) || 0), 0);

      const conversionRate = quotations.length > 0 
        ? (salesOrders.length / (salesOrders.length + quotations.length)) * 100 
        : 0;

      return {
        totalSalesOrders: salesOrders.length,
        totalRevenue,
        totalPending,
        totalReceived,
        totalQuotations: quotations.length,
        totalQuotationValue,
        conversionRate,
        totalCustomers: customerCount ?? 0,
      };
    },
  });
}

export function useSalesTrend() {
  return useQuery({
    queryKey: ['dashboard', 'sales-trend'],
    queryFn: async (): Promise<SalesTrendData[]> => {
      const months: SalesTrendData[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = format(startOfMonth(date), 'yyyy-MM-dd');
        const end = format(endOfMonth(date), 'yyyy-MM-dd');

        const { data, error } = await supabase
          .from('sales')
          .select('total')
          .eq('order_type', 'Sales order')
          .gte('order_date', start)
          .lte('order_date', end);

        if (error) throw error;

        const revenue = data?.reduce((sum, s) => sum + (Number(s.total) || 0), 0) || 0;

        months.push({
          period: format(date, 'MMM yyyy'),
          revenue,
          orders: data?.length || 0,
        });
      }

      return months;
    },
  });
}

export function useRevenueBySource() {
  return useQuery({
    queryKey: ['dashboard', 'revenue-by-source'],
    queryFn: async (): Promise<RevenueBySourceData[]> => {
      const { data, error } = await supabase
        .from('sales')
        .select('source, total')
        .eq('order_type', 'Sales order')
        .not('source', 'is', null);

      if (error) throw error;

      const sourceMap = new Map<string, number>();
      data?.forEach(sale => {
        const source = sale.source || 'Other';
        const current = sourceMap.get(source) || 0;
        sourceMap.set(source, current + (Number(sale.total) || 0));
      });

      return Array.from(sourceMap.entries())
        .map(([source, value]) => ({ source, value }))
        .sort((a, b) => b.value - a.value);
    },
  });
}

export function useOrderStatusDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'order-status'],
    queryFn: async (): Promise<OrderStatusData[]> => {
      const { data, error } = await supabase
        .from('sales')
        .select('order_status')
        .eq('order_type', 'Sales order');

      if (error) throw error;

      const statusMap = new Map<string, number>();
      data?.forEach(sale => {
        const status = sale.order_status || 'New';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });

      return Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }));
    },
  });
}

export function useTopCustomers() {
  return useQuery({
    queryKey: ['dashboard', 'top-customers'],
    queryFn: async (): Promise<TopCustomerData[]> => {
      const { data, error } = await supabase
        .from('sales')
        .select('customer_id, total, customers(customer_name)')
        .eq('order_type', 'Sales order')
        .not('customer_id', 'is', null);

      if (error) throw error;

      const customerMap = new Map<string, { name: string; revenue: number }>();
      data?.forEach((sale: any) => {
        const customerId = sale.customer_id;
        const customerName = sale.customers?.customer_name || 'Unknown';
        const current = customerMap.get(customerId) || { name: customerName, revenue: 0 };
        current.revenue += Number(sale.total) || 0;
        customerMap.set(customerId, current);
      });

      return Array.from(customerMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
        .map(c => ({ customer_name: c.name, revenue: c.revenue }));
    },
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['dashboard', 'recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*, customers(*)')
        .eq('order_type', 'Sales order')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as SaleWithCustomer[];
    },
  });
}

export function usePendingShipments() {
  return useQuery({
    queryKey: ['dashboard', 'pending-shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*, customers(*)')
        .eq('order_type', 'Sales order')
        .neq('shipped', 'Yes')
        .order('order_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as SaleWithCustomer[];
    },
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: ['dashboard', 'pending-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*, customers(*)')
        .eq('order_type', 'Sales order')
        .gt('amount_pending', 0)
        .order('amount_pending', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as SaleWithCustomer[];
    },
  });
}