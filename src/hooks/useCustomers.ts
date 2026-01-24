import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, FilterState, SortState } from '@/types';
import { toast } from 'sonner';

export function useCustomers(
  filters: FilterState,
  sort: SortState,
  page: number,
  pageSize: number
) {
  return useQuery({
    queryKey: ['customers', filters, sort, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('customers')
        .select('*', { count: 'exact' });

      // Apply search
      if (filters.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`
        );
      }

      // Apply country filter
      if (filters.customer_country && filters.customer_country.length > 0) {
        query = query.in('customer_country', filters.customer_country);
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
        data: data as Customer[],
        count: count ?? 0,
      };
    },
  });
}

export function useAllCustomers() {
  return useQuery({
    queryKey: ['customers', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('customer_name', { ascending: true });

      if (error) throw error;
      return data as Customer[];
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create customer: ${error.message}`);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: Partial<Customer> & { customer_id: string }) => {
      const { customer_id, ...updates } = customer;
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('customer_id', customer_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update customer: ${error.message}`);
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('customer_id', customerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete customer: ${error.message}`);
    },
  });
}

export function useBulkDeleteCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerIds: string[]) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .in('customer_id', customerIds);

      if (error) throw error;
    },
    onSuccess: (_, customerIds) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(`${customerIds.length} customers deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete customers: ${error.message}`);
    },
  });
}