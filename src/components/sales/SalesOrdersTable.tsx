import { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SaleWithCustomer, SortState } from '@/types';
import { formatCurrency, formatDate, truncateText } from '@/lib/formatters';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';

interface SalesOrdersTableProps {
  data: SaleWithCustomer[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (sale: SaleWithCustomer) => void;
  onDelete: (sale: SaleWithCustomer) => void;
  isLoading?: boolean;
}

const columns = [
  { key: 'order_id', label: 'Order ID', sortable: true },
  { key: 'order_date', label: 'Date', sortable: true },
  { key: 'customer_id', label: 'Customer', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'order_status', label: 'Order Status', sortable: true },
  { key: 'source', label: 'Source', sortable: true },
  { key: 'shipped', label: 'Shipped', sortable: true },
  { key: 'amount_pending', label: 'Pending', sortable: true },
];

export function SalesOrdersTable({
  data,
  sort,
  onSortChange,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  isLoading,
}: SalesOrdersTableProps) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((item) => item.order_id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleSort = (column: string) => {
    if (sort.column === column) {
      onSortChange({
        column,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({ column, direction: 'asc' });
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className={cn(someSelected && 'data-[state=checked]:bg-primary/50')}
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.key}>
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 hover:bg-transparent"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    <ArrowUpDown
                      className={cn(
                        'ml-2 h-4 w-4',
                        sort.column === column.key && 'text-primary'
                      )}
                    />
                  </Button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                {isLoading ? 'Loading...' : 'No sales orders found'}
              </TableCell>
            </TableRow>
          ) : (
            data.map((sale) => (
              <TableRow
                key={sale.order_id}
                className={cn(
                  'transition-colors hover:bg-muted/50',
                  selectedIds.includes(sale.order_id) && 'bg-primary/5'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(sale.order_id)}
                    onCheckedChange={() => handleSelectOne(sale.order_id)}
                    aria-label={`Select ${sale.order_id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{sale.order_id}</TableCell>
                <TableCell>{formatDate(sale.order_date)}</TableCell>
                <TableCell>{sale.customers?.customer_name || '-'}</TableCell>
                <TableCell className="font-medium">{formatCurrency(sale.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={sale.status} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={sale.order_status} />
                </TableCell>
                <TableCell>{truncateText(sale.source, 15)}</TableCell>
                <TableCell>
                  <StatusBadge status={sale.shipped} />
                </TableCell>
                <TableCell className="font-medium text-warning-600">
                  {formatCurrency(sale.amount_pending)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(sale)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(sale)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}