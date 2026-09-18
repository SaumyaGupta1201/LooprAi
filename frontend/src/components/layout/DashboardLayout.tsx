import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '240px' }}>{children}</Box>
    </Box>
  );
}