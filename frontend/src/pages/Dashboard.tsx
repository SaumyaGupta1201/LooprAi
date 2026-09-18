import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Topbar } from '../components/layout/Topbar';
import { SummaryCards } from '../components/SummaryCards';
import { OverviewChart } from '../components/OverviewChart';
import { BreakdownChart } from '../components/BreakdownChart';
import { UserBreakdownChart } from '../components/UserBreakdownChart';
import { RecentTransactions } from '../components/RecentTransactions';
import { TransactionsTable } from '../components/TransactionsTable';
import { ExportModal } from '../components/ExportModal';
import { Box } from '@mui/material';
import * as txnApi from '../api/transactions';
import * as analyticsApi from '../api/analytics';
import { Transaction, Pagination, FilterOptions, Summary, TrendPoint, Breakdown } from '../types';

export function Dashboard() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [rows, setRows] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [exportOpen, setExportOpen] = useState(false);

  const filters = {
    category, status, search, user_id: userId,
    startDate, endDate, minAmount, maxAmount,
  };

  const loadTable = useCallback(() => {
    txnApi.getTransactions({
      page, limit, sortBy, order, search, category, status,
      user_id: userId, startDate, endDate,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    }).then((res) => { setRows(res.data.data); setPagination(res.data.pagination); });
  }, [page, limit, sortBy, order, search, category, status, userId, startDate, endDate, minAmount, maxAmount]);

  useEffect(() => { loadTable(); }, [loadTable]);

  useEffect(() => {
    txnApi.getFilterOptions().then((res) => setFilterOptions(res.data.data));
    analyticsApi.getRecent(5).then((res) => setRecent(res.data.data));
  }, []);

  useEffect(() => {
    analyticsApi.getSummary(filters).then((res) => setSummary(res.data.data));
    analyticsApi.getTrend(filters).then((res) => setTrend(res.data.data));
    analyticsApi.getBreakdown(filters).then((res) => setBreakdown(res.data.data));
  }, [category, status, search, userId, startDate, endDate, minAmount, maxAmount]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setUserId('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('asc'); }
  };

  return (
    <DashboardLayout>
      <Topbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} />

      <SummaryCards summary={summary} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, px: 4, mt: 3, mb: 3 }}>
        <OverviewChart trend={trend} />
        <RecentTransactions items={recent} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2, px: 4, mb: 3 }}>
        <BreakdownChart breakdown={breakdown} />
        <UserBreakdownChart breakdown={breakdown} />
      </Box>

      <TransactionsTable
        rows={rows}
        pagination={pagination}
        filters={filterOptions}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        category={category}
        onCategoryChange={(v) => { setCategory(v); setPage(1); }}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        userId={userId}
        onUserIdChange={(v) => { setUserId(v); setPage(1); }}
        startDate={startDate}
        onStartDateChange={(v) => { setStartDate(v); setPage(1); }}
        endDate={endDate}
        onEndDateChange={(v) => { setEndDate(v); setPage(1); }}
        minAmount={minAmount}
        onMinAmountChange={(v) => { setMinAmount(v); setPage(1); }}
        maxAmount={maxAmount}
        onMaxAmountChange={(v) => { setMaxAmount(v); setPage(1); }}
        sortBy={sortBy}
        order={order}
        onSortChange={handleSort}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onExportClick={() => setExportOpen(true)}
        onClearFilters={handleClearFilters}
      />

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} filters={filters} sortBy={sortBy} order={order} />
    </DashboardLayout>
  );
}