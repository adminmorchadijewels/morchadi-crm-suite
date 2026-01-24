import { useState, useCallback } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { FilterPanel } from '@/components/common/FilterPanel';
import { DataTablePagination } from '@/components/common/DataTablePagination';
import { CustomersTable } from '@/components/customers/CustomersTable';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import {
  useCustomers,
  useDeleteCustomer,
  useBulkDeleteCustomers,
} from '@/hooks/useCustomers';
import { Customer, FilterState, SortState } from '@/types';
import { COUNTRY_OPTIONS } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';

const filterFields = [
  {
    key: 'customer_country',
    label: 'Country',
    type: 'select' as const,
    options: COUNTRY_OPTIONS.map((c) => ({ label: c, value: c })),
  },
];

export default function Customers() {
  const [filters, setFilters] = useState<FilterState>({ search: '' });
  const [sort, setSort] = useState<SortState>({ column: 'created_at', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useCustomers(filters, sort, page, pageSize);
  const deleteCustomer = useDeleteCustomer();
  const bulkDeleteCustomers = useBulkDeleteCustomers();

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(0);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingCustomer) {
      await deleteCustomer.mutateAsync(deletingCustomer.customer_id);
      setDeleteDialogOpen(false);
      setDeletingCustomer(null);
    }
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteCustomers.mutateAsync(selectedIds);
    setBulkDeleteDialogOpen(false);
    setSelectedIds([]);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingCustomer(null);
  };

  if (isLoading) {
    return (
      <MainLayout title="Customers">
        <LoadingPage />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Customers">
      <div className="space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="w-full sm:max-w-xs">
              <SearchInput
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search customers..."
              />
            </div>
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              fields={filterFields}
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedIds.length})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </div>
        </div>

        {/* Table */}
        <CustomersTable
          data={data?.data || []}
          sort={sort}
          onSortChange={setSort}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isFetching}
        />

        {/* Pagination */}
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          totalCount={data?.count || 0}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          selectedCount={selectedIds.length}
        />

        {/* Form Modal */}
        <CustomerForm
          open={formOpen}
          onOpenChange={handleFormClose}
          customer={editingCustomer}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Customer"
          description={`Are you sure you want to delete "${deletingCustomer?.customer_name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={confirmDelete}
          loading={deleteCustomer.isPending}
        />

        {/* Bulk Delete Confirmation */}
        <ConfirmDialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
          title="Delete Multiple Customers"
          description={`Are you sure you want to delete ${selectedIds.length} customers? This action cannot be undone.`}
          confirmLabel="Delete All"
          variant="destructive"
          onConfirm={confirmBulkDelete}
          loading={bulkDeleteCustomers.isPending}
        />
      </div>
    </MainLayout>
  );
}