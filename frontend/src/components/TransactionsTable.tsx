import {
  Paper, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  TableSortLabel, Chip, Avatar, TablePagination, MenuItem, Select, InputBase, Button, Stack, TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { Transaction, Pagination, FilterOptions } from '../types';

interface Props {
  rows: Transaction[];
  pagination: Pagination;
  filters: FilterOptions | null;
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  userId: string;
  onUserIdChange: (v: string) => void;
  startDate: string;
  onStartDateChange: (v: string) => void;
  endDate: string;
  onEndDateChange: (v: string) => void;
  minAmount: string;
  onMinAmountChange: (v: string) => void;
  maxAmount: string;
  onMaxAmountChange: (v: string) => void;
  sortBy: string;
  order: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onExportClick: () => void;
  onClearFilters: () => void;
}

const COLUMNS: { key: string; label: string }[] = [
  { key: 'userName', label: 'Name' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
];

export function TransactionsTable(props: Props) {
  const { rows, pagination, filters, search, onSearchChange, category, onCategoryChange,
    status, onStatusChange, userId, onUserIdChange, startDate, onStartDateChange,
    endDate, onEndDateChange, minAmount, onMinAmountChange, maxAmount, onMaxAmountChange,
    sortBy, order, onSortChange, onPageChange, onLimitChange, onExportClick, onClearFilters } = props;

  return (
    <Paper id="transactions-table" sx={{ p: 3, mx: 4, mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Transactions</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderRadius: 2, px: 1.5, py: 0.5, minWidth: 200 }}>
              <SearchIcon fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
              <InputBase
                placeholder="Search for anything..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{ width: '100%' }}
              />
            </Box>
            <Button variant="contained" startIcon={<FileDownloadOutlined />} onClick={onExportClick} sx={{ whiteSpace: 'nowrap' }}>
              Export CSV
            </Button>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
          <Select size="small" value={category} displayEmpty onChange={(e) => onCategoryChange(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="">All Categories</MenuItem>
            {filters?.categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
          <Select size="small" value={status} displayEmpty onChange={(e) => onStatusChange(e.target.value)} sx={{ minWidth: 130 }}>
            <MenuItem value="">All Statuses</MenuItem>
            {filters?.statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
          <Select size="small" value={userId} displayEmpty onChange={(e) => onUserIdChange(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="">All Users</MenuItem>
            {filters?.users.map((u) => <MenuItem key={u.user_id} value={u.user_id}>{u.name}</MenuItem>)}
          </Select>
          <TextField
            size="small" type="date" label="From" slotProps={{ inputLabel: { shrink: true } }}
            value={startDate} onChange={(e) => onStartDateChange(e.target.value)}
            sx={{ minWidth: 150 }}
          />
          <TextField
            size="small" type="date" label="To" slotProps={{ inputLabel: { shrink: true } }}
            value={endDate} onChange={(e) => onEndDateChange(e.target.value)}
            sx={{ minWidth: 150 }}
          />
          <TextField
            size="small" type="number" label="Min $" value={minAmount}
            onChange={(e) => onMinAmountChange(e.target.value)}
            sx={{ width: 110 }}
          />
          <TextField
            size="small" type="number" label="Max $" value={maxAmount}
            onChange={(e) => onMaxAmountChange(e.target.value)}
            sx={{ width: 110 }}
          />
          <Button
            size="small" variant="outlined" color="inherit" startIcon={<ClearIcon />}
            onClick={onClearFilters} sx={{ whiteSpace: 'nowrap' }}
          >
            Clear
          </Button>
        </Stack>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableCell key={col.key}>
                <TableSortLabel
                  active={sortBy === col.key}
                  direction={sortBy === col.key ? order : 'asc'}
                  onClick={() => onSortChange(col.key)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((t) => (
            <TableRow key={t._id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={t.avatar} sx={{ width: 32, height: 32 }}>{t.userName?.[0]}</Avatar>
                  {t.userName}
                </Box>
              </TableCell>
              <TableCell>{new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
              <TableCell sx={{ color: t.category === 'Revenue' ? 'success.main' : 'warning.main', fontWeight: 600 }}>
                {t.category === 'Revenue' ? '+' : '-'}${t.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Chip label={t.status} size="small" color={t.status === 'Paid' ? 'success' : 'warning'} variant="filled" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Box>

      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page - 1}
        onPageChange={(_, p) => onPageChange(p + 1)}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={(e) => onLimitChange(Number(e.target.value))}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}