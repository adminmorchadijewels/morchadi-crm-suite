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

interface OpportunitiesTableProps {
  data: SaleWithCustomer[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (opportunity: SaleWithCustomer) => void;
  onDelete: (opportunity: SaleWithCustomer) => void;
  isLoading?: boolean;
}

const columns = [
  { key: 'order_id', label: 'Quote ID', sortable: true },
  { key: 'order_date', label: 'Date', sortable: true },
  { key: 'customer_id', label: 'Customer', sortable: true },
  { key: 'total', label: 'Value', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'source', label: 'Source', sortable: true },
  { key: 'remark', label: 'Remark', sortable: false },
];

export function OpportunitiesTable({
  data,
  sort,
  onSortChange,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  isLoading,
}: OpportunitiesTableProps) {
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
                {isLoading ? 'Loading...' : 'No quotations found'}
              </TableCell>
            </TableRow>
          ) : (
            data.map((opportunity) => (
              <TableRow
                key={opportunity.order_id}
                className={cn(
                  'transition-colors hover:bg-muted/50',
                  selectedIds.includes(opportunity.order_id) && 'bg-primary/5'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(opportunity.order_id)}
                    onCheckedChange={() => handleSelectOne(opportunity.order_id)}
                    aria-label={`Select ${opportunity.order_id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{opportunity.order_id}</TableCell>
                <TableCell>{formatDate(opportunity.order_date)}</TableCell>
                <TableCell>{opportunity.customers?.customer_name || '-'}</TableCell>
                <TableCell className="font-medium">{formatCurrency(opportunity.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={opportunity.status} />
                </TableCell>
                <TableCell>{truncateText(opportunity.source, 15)}</TableCell>
                <TableCell>{truncateText(opportunity.remark, 25)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(opportunity)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(opportunity)}
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