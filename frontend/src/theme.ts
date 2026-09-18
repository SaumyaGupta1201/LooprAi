import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#22c55e' },
    background: { default: '#0e1015', paper: '#161922' },
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: `'Inter', 'Roboto', sans-serif` },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});