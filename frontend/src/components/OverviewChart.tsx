import { Paper, Typography, Box, Select, MenuItem } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendPoint } from '../types';

type Period = 'weekly' | 'monthly' | 'yearly';

interface Props {
  trend: TrendPoint[];
  period: Period;
  onPeriodChange: (p: Period) => void;
}

export function OverviewChart({ trend, period, onPeriodChange }: Props) {
  return (
    <Paper sx={{ p: 3, height: 360 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
       <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Overview</Typography>
       <Select
         size="small"
         value={period}
         onChange={(e) => onPeriodChange(e.target.value as Period)}
         sx={{ minWidth: 110 }}
       >
         <MenuItem value="weekly">Weekly</MenuItem>
         <MenuItem value="monthly">Monthly</MenuItem>
         <MenuItem value="yearly">Yearly</MenuItem>
       </Select>
      </Box>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
          <Tooltip contentStyle={{ background: '#161922', border: 'none', borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Income" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}