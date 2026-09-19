import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Breakdown } from '../types';

const COLORS: Record<string, string> = {
  Revenue: '#22c55e',
  Expense: '#f59e0b',
};

export function BreakdownChart({ breakdown }: { breakdown: Breakdown | null }) {
  const data = breakdown?.byCategory ?? [];

  return (
    <Paper sx={{ p: 3, height: 420, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Category Breakdown
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={COLORS[d.name] ?? '#6366f1'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#161922', border: 'none', borderRadius: 8 }}
              formatter={(value) => `$${Number(value).toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        {!data.length && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.5,
            }}
          >
            No data
          </Box>
        )}
      </Box>
      {!!breakdown?.byStatus.length && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 1, flexShrink: 0 }}>
          {breakdown.byStatus.map((s) => (
            <Typography key={s.name} variant="caption" sx={{ opacity: 0.7, whiteSpace: 'nowrap' }}>
              {s.name}: ${s.total.toFixed(2)} ({s.count})
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}