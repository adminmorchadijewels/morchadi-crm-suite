import { SaleWithCustomer } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PendingPaymentsTableProps {
  data: SaleWithCustomer[];
}

export function PendingPaymentsTable({ data }: PendingPaymentsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">Pending Payments</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Pending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No pending payments
                </TableCell>
              </TableRow>
            ) : (
              data.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{order.customers?.customer_name || '-'}</TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-warning-600">
                    {formatCurrency(order.amount_pending)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}