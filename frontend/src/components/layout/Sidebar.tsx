import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { label: 'Dashboard', icon: <DashboardIcon />, id: 'top' },
  { label: 'Transactions', icon: <ReceiptLongIcon />, id: 'transactions-table' },
];

export function Sidebar() {
  const { logout } = useAuth();

  const scrollTo = (id: string) => {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: 'background.paper',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        // no longer need display:flex/flexDirection here since Logout is positioned absolutely
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Typography variant="h6" sx={{ p: 3, fontWeight: 700 }}>
        Loopr <Box component="span" sx={{ color: 'primary.main' }}>Finance</Box>
      </Typography>

      <List sx={{ px: 1 }}>
        {NAV.map((item, i) => (
          <ListItemButton key={item.label} selected={i === 0} onClick={() => scrollTo(item.id)} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      {/* Pinned absolutely to the sidebar's bottom edge — no flex ambiguity */}
      <ListItemButton
        onClick={logout}
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          borderRadius: 2,
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </Box>
  );
}