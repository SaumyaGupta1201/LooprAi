import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ marginLeft: { xs: 0, md: '240px' }, pt: { xs: '56px', md: 0 } }}>{children}</Box>
    </Box>
  );
}