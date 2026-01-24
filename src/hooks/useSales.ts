import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleWithCustomer, FilterState, SortState } from '@/types';
import { toast } from 'sonner';

export function useSalesOrders(
  filters: FilterState,
  sort: SortState,
  page: number,
  pageSize: number
) {
  return useQuery({
    queryKey: ['sales-orders', filters, sort, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('sales')
        .select('*, customers(*)', { count: 'exact' })
        .eq('order_type', 'Sales order');

      // Apply search
      if (filters.search) {
        query = query.or(
          `order_id.ilike.%${filters.search}%,invoice.ilike.%${filters.search}%,customer_id.ilike.%${filters.search}%`
        );
      }

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.order_status && filters.order_status.length > 0) {
        query = query.in('order_status', filters.order_status);
      }
      if (filters.source && filters.source.length > 0) {
        query = query.in('source', filters.source);
      }
      if (filters.payment_type && filters.payment_type.length > 0) {
        query = query.in('payment_type', filters.payment_type);
      }
      if (filters.date_from) {
        query = query.gte('order_date', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('order_date', filters.date_to);
      }

      // Apply sorting
      query = query.order(sort.column, { ascending: sort.direction === 'asc' });

      // Apply pagination
      const from = page * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data as SaleWithCustomer[],
        count: count ?? 0,
      };
    },
  });
}

export function useOpportunities(
  filters: FilterState,
  sort: SortState,
  page: number,
  pageSize: number
) {
  return useQuery({
    queryKey: ['opportunities', filters, sort, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('sales')
        .select('*, customers(*)', { count: 'exact' })
        .eq('order_type', 'Quotation');

      // Apply search
      if (filters.search) {
        query = query.or(
          `order_id.ilike.%${filters.search}%,customer_id.ilike.%${filters.search}%`
        );
      }

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.date_from) {
        query = query.gte('order_date', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('order_date', filters.date_to);
      }

      // Apply sorting
      query = query.order(sort.column, { ascending: sort.direction === 'asc' });

      // Apply pagination
      const from = page * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data as SaleWithCustomer[],
        count: count ?? 0,
      };
    },
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sale: Omit<Sale, 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sales')
        .insert(sale)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      const message = data.order_type === 'Sales order' 
        ? 'Sales order created successfully' 
        : 'Quotation created successfully';
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sale: Partial<Sale> & { order_id: string }) => {
      const { order_id, ...updates } = sale;
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('order_id', order_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('order_id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

export function useBulkDeleteSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderIds: string[]) => {
      const { error } = await supabase
        .from('sales')
        .delete()
        .in('order_id', orderIds);

      if (error) throw error;
    },
    onSuccess: (_, orderIds) => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`${orderIds.length} records deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}