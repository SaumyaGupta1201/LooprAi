import { Box, Paper, Typography } from '@mui/material';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined';
import SavingsOutlined from '@mui/icons-material/SavingsOutlined';
import { Summary } from '../types';

const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export function SummaryCards({ summary }: { summary: Summary | null }) {
  const cards = [
    { label: 'Balance', value: summary?.balance ?? 0, icon: <AccountBalanceWalletOutlined /> },
    { label: 'Revenue', value: summary?.revenue ?? 0, icon: <TrendingUpOutlined /> },
    { label: 'Expenses', value: summary?.expenses ?? 0, icon: <TrendingDownOutlined /> },
    { label: 'Savings', value: summary?.savings ?? 0, icon: <SavingsOutlined /> },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, px: 4 }}>
      {cards.map((c) => (
        <Paper key={c.label} sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: 'rgba(34,197,94,0.12)', color: 'primary.main', p: 1.2, borderRadius: 2, display: 'flex' }}>
            {c.icon}
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">{c.label}</Typography>
           <Typography variant="h6" sx={{ fontWeight: 700 }}>{fmt(c.value)}</Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}