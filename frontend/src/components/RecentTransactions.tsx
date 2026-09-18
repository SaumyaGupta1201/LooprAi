import { Paper, Typography, Box, Avatar, Stack } from '@mui/material';
import { Transaction } from '../types';

const fmt = (n: number) => `${n >= 0 ? '+' : ''}$${Math.abs(n).toFixed(2)}`;

export function RecentTransactions({ items }: { items: Transaction[] }) {
  return (
    <Paper sx={{ p: 3, height: 360, overflowY: 'auto' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Recent Transactions</Typography>
      <Stack spacing={2}>
        {items.map((t) => {
          const signed = t.category === 'Revenue' ? t.amount : -t.amount;
          return (
            <Box key={t._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={t.avatar} sx={{ width: 36, height: 36 }}>{t.userName?.[0]}</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{t.userName}</Typography>
                <Typography variant="caption" color="text.secondary">{t.category}</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: signed >= 0 ? 'success.main' : 'warning.main' }}>
                {fmt(signed)}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}