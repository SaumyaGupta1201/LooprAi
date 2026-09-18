import { Paper, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Breakdown } from '../types';

export function UserBreakdownChart({ breakdown }: { breakdown: Breakdown | null }) {
  const data = breakdown?.byUser ?? [];

  return (
    <Paper sx={{ p: 3, height: 360 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Revenue vs Expenses by User
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} barCategoryGap="30%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} padding={{ left: 20, right: 20 }} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
          <Tooltip
            contentStyle={{ background: '#161922', border: 'none', borderRadius: 8 }}
            formatter={(value) => `$${Number(value).toFixed(2)}`}
          />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={48} />
          <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
              {!data.length && (
        <Typography sx={{ textAlign: 'center', mt: -20, opacity: 0.5 }}>No data</Typography>
      )}
      </ResponsiveContainer>
    </Paper>
  );
}