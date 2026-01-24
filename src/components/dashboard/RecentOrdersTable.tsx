import { SaleWithCustomer } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RecentOrdersTableProps {
  data: SaleWithCustomer[];
  title: string;
}

export function RecentOrdersTable({ data, title }: RecentOrdersTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{order.customers?.customer_name || '-'}</TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.order_status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.total)}
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