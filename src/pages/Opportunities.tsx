import { useState, useCallback } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { FilterPanel } from '@/components/common/FilterPanel';
import { DataTablePagination } from '@/components/common/DataTablePagination';
import { OpportunitiesTable } from '@/components/opportunities/OpportunitiesTable';
import { OpportunityForm } from '@/components/opportunities/OpportunityForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { useOpportunities, useDeleteSale, useBulkDeleteSales } from '@/hooks/useSales';
import { SaleWithCustomer, FilterState, SortState } from '@/types';
import { STATUS_OPTIONS } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';

const filterFields = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
  },
  { key: 'date_from', label: 'From Date', type: 'date' as const },
  { key: 'date_to', label: 'To Date', type: 'date' as const },
];

export default function Opportunities() {
  const [filters, setFilters] = useState<FilterState>({ search: '' });
  const [sort, setSort] = useState<SortState>({ column: 'created_at', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<SaleWithCustomer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingOpportunity, setDeletingOpportunity] = useState<SaleWithCustomer | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useOpportunities(filters, sort, page, pageSize);
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
    queryClient.invalidateQueries({ queryKey: ['opportunities'] });
  };

  const handleEdit = (opportunity: SaleWithCustomer) => {
    setEditingOpportunity(opportunity);
    setFormOpen(true);
  };

  const handleDelete = (opportunity: SaleWithCustomer) => {
    setDeletingOpportunity(opportunity);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingOpportunity) {
      await deleteSale.mutateAsync(deletingOpportunity.order_id);
      setDeleteDialogOpen(false);
      setDeletingOpportunity(null);
    }
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteSales.mutateAsync(selectedIds);
    setBulkDeleteDialogOpen(false);
    setSelectedIds([]);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingOpportunity(null);
  };

  if (isLoading) {
    return (
      <MainLayout title="Opportunities">
        <LoadingPage />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Opportunities">
      <div className="space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="w-full sm:max-w-xs">
              <SearchInput
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search quotations..."
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
              New Quotation
            </Button>
          </div>
        </div>

        {/* Table */}
        <OpportunitiesTable
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
        <OpportunityForm
          open={formOpen}
          onOpenChange={handleFormClose}
          opportunity={editingOpportunity}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Quotation"
          description={`Are you sure you want to delete quotation "${deletingOpportunity?.order_id}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={confirmDelete}
          loading={deleteSale.isPending}
        />

        {/* Bulk Delete Confirmation */}
        <ConfirmDialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
          title="Delete Multiple Quotations"
          description={`Are you sure you want to delete ${selectedIds.length} quotations? This action cannot be undone.`}
          confirmLabel="Delete All"
          variant="destructive"
          onConfirm={confirmBulkDelete}
          loading={bulkDeleteSales.isPending}
        />
      </div>
    </MainLayout>
  );
}