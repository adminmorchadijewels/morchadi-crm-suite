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
import { Customer, SortState } from '@/types';
import { formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface CustomersTableProps {
  data: Customer[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  isLoading?: boolean;
}

const columns = [
  { key: 'customer_id', label: 'Customer ID', sortable: true },
  { key: 'customer_name', label: 'Name', sortable: true },
  { key: 'customer_email', label: 'Email', sortable: true },
  { key: 'customer_phone', label: 'Phone', sortable: true },
  { key: 'customer_country', label: 'Country', sortable: true },
  { key: 'created_at', label: 'Created', sortable: true },
];

export function CustomersTable({
  data,
  sort,
  onSortChange,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  isLoading,
}: CustomersTableProps) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((item) => item.customer_id));
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
                {isLoading ? 'Loading...' : 'No customers found'}
              </TableCell>
            </TableRow>
          ) : (
            data.map((customer) => (
              <TableRow
                key={customer.customer_id}
                className={cn(
                  'transition-colors hover:bg-muted/50',
                  selectedIds.includes(customer.customer_id) && 'bg-primary/5'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(customer.customer_id)}
                    onCheckedChange={() => handleSelectOne(customer.customer_id)}
                    aria-label={`Select ${customer.customer_name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{customer.customer_id}</TableCell>
                <TableCell className="font-medium">{customer.customer_name}</TableCell>
                <TableCell>{customer.customer_email || '-'}</TableCell>
                <TableCell>{customer.customer_phone || '-'}</TableCell>
                <TableCell>{customer.customer_country || '-'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(customer.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(customer)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(customer)}
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