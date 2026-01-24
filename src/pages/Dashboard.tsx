import {
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  Users,
  Target,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { RevenueBySourceChart } from '@/components/dashboard/RevenueBySourceChart';
import { OrderStatusChart } from '@/components/dashboard/OrderStatusChart';
import { TopCustomersChart } from '@/components/dashboard/TopCustomersChart';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { PendingShipmentsTable } from '@/components/dashboard/PendingShipmentsTable';
import { PendingPaymentsTable } from '@/components/dashboard/PendingPaymentsTable';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import {
  useDashboardKPIs,
  useSalesTrend,
  useRevenueBySource,
  useOrderStatusDistribution,
  useTopCustomers,
  useRecentOrders,
  usePendingShipments,
  usePendingPayments,
} from '@/hooks/useDashboard';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/formatters';

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs();
  const { data: salesTrend = [] } = useSalesTrend();
  const { data: revenueBySource = [] } = useRevenueBySource();
  const { data: orderStatus = [] } = useOrderStatusDistribution();
  const { data: topCustomers = [] } = useTopCustomers();
  const { data: recentOrders = [] } = useRecentOrders();
  const { data: pendingShipments = [] } = usePendingShipments();
  const { data: pendingPayments = [] } = usePendingPayments();

  if (kpisLoading) {
    return (
      <MainLayout title="Dashboard">
        <LoadingPage />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Sales Orders"
            value={formatNumber(kpis?.totalSalesOrders ?? 0)}
            icon={<ShoppingCart className="h-6 w-6" />}
          />
          <KPICard
            title="Total Revenue"
            value={formatCurrency(kpis?.totalRevenue ?? 0)}
            icon={<DollarSign className="h-6 w-6" />}
          />
          <KPICard
            title="Amount Pending"
            value={formatCurrency(kpis?.totalPending ?? 0)}
            icon={<Clock className="h-6 w-6" />}
          />
          <KPICard
            title="Amount Received"
            value={formatCurrency(kpis?.totalReceived ?? 0)}
            icon={<CheckCircle className="h-6 w-6" />}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Quotations"
            value={formatNumber(kpis?.totalQuotations ?? 0)}
            icon={<FileText className="h-6 w-6" />}
          />
          <KPICard
            title="Quotation Value"
            value={formatCurrency(kpis?.totalQuotationValue ?? 0)}
            icon={<Target className="h-6 w-6" />}
          />
          <KPICard
            title="Conversion Rate"
            value={formatPercentage(kpis?.conversionRate ?? 0)}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <KPICard
            title="Total Customers"
            value={formatNumber(kpis?.totalCustomers ?? 0)}
            icon={<Users className="h-6 w-6" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesTrendChart data={salesTrend} />
          <RevenueBySourceChart data={revenueBySource} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <OrderStatusChart data={orderStatus} />
          <TopCustomersChart data={topCustomers} />
        </div>

        {/* Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentOrdersTable data={recentOrders} title="Recent Orders" />
          <PendingShipmentsTable data={pendingShipments} />
        </div>

        <PendingPaymentsTable data={pendingPayments} />
      </div>
    </MainLayout>
  );
}