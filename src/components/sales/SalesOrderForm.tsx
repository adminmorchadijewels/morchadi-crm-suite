import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sale, Customer } from '@/types';
import {
  STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
  SOURCE_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  YES_NO_OPTIONS,
} from '@/lib/constants';
import { generateOrderId } from '@/lib/formatters';
import { useCreateSale, useUpdateSale } from '@/hooks/useSales';
import { useAllCustomers } from '@/hooks/useCustomers';

const saleSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  order_date: z.string().optional(),
  total: z.coerce.number().min(0, 'Total must be positive'),
  invoice: z.string().optional(),
  status: z.string().optional(),
  customer_id: z.string().optional(),
  source: z.string().optional(),
  order_status: z.string().optional(),
  shipped: z.string().optional(),
  tracking_id_shared: z.string().optional(),
  delivered: z.string().optional(),
  payment_type: z.string().optional(),
  amount_received: z.coerce.number().min(0, 'Amount must be positive'),
  tracking_id: z.string().optional(),
  amount_pending: z.coerce.number().min(0, 'Amount must be positive'),
  remark: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SalesOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: Sale | null;
}

export function SalesOrderForm({ open, onOpenChange, sale }: SalesOrderFormProps) {
  const isEditing = !!sale;
  const createSale = useCreateSale();
  const updateSale = useUpdateSale();
  const { data: customers = [] } = useAllCustomers();

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      order_id: sale?.order_id || generateOrderId(),
      order_date: sale?.order_date || new Date().toISOString().split('T')[0],
      total: sale?.total || 0,
      invoice: sale?.invoice || '',
      status: sale?.status || 'Pending',
      customer_id: sale?.customer_id || '',
      source: sale?.source || '',
      order_status: sale?.order_status || 'New',
      shipped: sale?.shipped || 'No',
      tracking_id_shared: sale?.tracking_id_shared || 'No',
      delivered: sale?.delivered || 'No',
      payment_type: sale?.payment_type || '',
      amount_received: sale?.amount_received || 0,
      tracking_id: sale?.tracking_id || '',
      amount_pending: sale?.amount_pending || 0,
      remark: sale?.remark || '',
    },
  });

  const onSubmit = async (data: SaleFormData) => {
    try {
      const saleData = {
        order_id: data.order_id,
        total: data.total,
        amount_received: data.amount_received,
        amount_pending: data.amount_pending,
        order_type: 'Sales order' as const,
        order_date: data.order_date || null,
        invoice: data.invoice || null,
        status: data.status || null,
        customer_id: data.customer_id || null,
        source: data.source || null,
        order_status: data.order_status || null,
        shipped: data.shipped || null,
        tracking_id_shared: data.tracking_id_shared || null,
        delivered: data.delivered || null,
        payment_type: data.payment_type || null,
        tracking_id: data.tracking_id || null,
        remark: data.remark || null,
      };

      if (isEditing) {
        await updateSale.mutateAsync(saleData);
      } else {
        await createSale.mutateAsync(saleData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const isLoading = createSale.isPending || updateSale.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Sales Order' : 'New Sales Order'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="order_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order ID *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.customer_id}
                            value={customer.customer_id}
                          >
                            {customer.customer_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SOURCE_OPTIONS.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ORDER_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount_received"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Received</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount_pending"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Pending</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shipped"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipped</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {YES_NO_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tracking_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tracking_id_shared"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Shared</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {YES_NO_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivered</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {YES_NO_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}