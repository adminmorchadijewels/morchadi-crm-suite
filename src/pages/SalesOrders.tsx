import { useState, useCallback } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { FilterPanel } from '@/components/common/FilterPanel';
import { DataTablePagination } from '@/components/common/DataTablePagination';
import { SalesOrdersTable } from '@/components/sales/SalesOrdersTable';
import { SalesOrderForm } from '@/components/sales/SalesOrderForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { useSalesOrders, useDeleteSale, useBulkDeleteSales } from '@/hooks/useSales';
import { SaleWithCustomer, FilterState, SortState } from '@/types';
import {
  STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
  SOURCE_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
} from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';

const filterFields = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
  },
  {
    key: 'order_status',
    label: 'Order Status',
    type: 'select' as const,
    options: ORDER_STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
  },
  {
    key: 'source',
    label: 'Source',
    type: 'select' as const,
    options: SOURCE_OPTIONS.map((s) => ({ label: s, value: s })),
  },
  {
    key: 'payment_type',
    label: 'Payment Type',
    type: 'select' as const,
    options: PAYMENT_TYPE_OPTIONS.map((s) => ({ label: s, value: s })),
  },
  { key: 'date_from', label: 'From Date', type: 'date' as const },
  { key: 'date_to', label: 'To Date', type: 'date' as const },
];

export default function SalesOrders() {
  const [filters, setFilters] = useState<FilterState>({ search: '' });
  const [sort, setSort] = useState<SortState>({ column: 'created_at', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleWithCustomer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSale, setDeletingSale] = useState<SaleWithCustomer | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useSalesOrders(filters, sort, page, pageSize);
  const deleteSale = useDeleteSale();
  const bulkDeleteSales = useBulkDeleteSales();

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(0);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
  };

  const handleEdit = (sale: SaleWithCustomer) => {
    setEditingSale(sale);
    setFormOpen(true);
  };

  const handleDelete = (sale: SaleWithCustomer) => {
    setDeletingSale(sale);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingSale) {
      await deleteSale.mutateAsync(deletingSale.order_id);
      setDeleteDialogOpen(false);
      setDeletingSale(null);
    }
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteSales.mutateAsync(selectedIds);
    setBulkDeleteDialogOpen(false);
    setSelectedIds([]);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingSale(null);
  };

  if (isLoading) {
    return (
      <MainLayout title="Sales Orders">
        <LoadingPage />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Sales Orders">
      <div className="space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="w-full sm:max-w-xs">
              <SearchInput
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search orders..."
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
              New Order
            </Button>
          </div>
        </div>

        {/* Table */}
        <SalesOrdersTable
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
        <SalesOrderForm
          open={formOpen}
          onOpenChange={handleFormClose}
          sale={editingSale}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Sales Order"
          description={`Are you sure you want to delete order "${deletingSale?.order_id}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={confirmDelete}
          loading={deleteSale.isPending}
        />

        {/* Bulk Delete Confirmation */}
        <ConfirmDialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
          title="Delete Multiple Orders"
          description={`Are you sure you want to delete ${selectedIds.length} orders? This action cannot be undone.`}
          confirmLabel="Delete All"
          variant="destructive"
          onConfirm={confirmBulkDelete}
          loading={bulkDeleteSales.isPending}
        />
      </div>
    </MainLayout>
  );
}