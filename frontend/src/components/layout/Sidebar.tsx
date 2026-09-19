import { Box, List, ListItemButton, ListItemIcon, ListItemText, Drawer, AppBar, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/useAuth';
import pentaLogo from '../../assets/logo.png';

const NAV = [
  { label: 'Dashboard', icon: <DashboardIcon />, id: 'top' },
  { label: 'Transactions', icon: <ReceiptLongIcon />, id: 'transactions-table' },
];

export function Sidebar() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const content = (
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
      <Box sx={{ p: 3 }}>
        <img src={pentaLogo} alt="Penta" style={{ height: 28, display: 'block' }} />
      </Box>
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

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ display: { xs: 'flex', md: 'none' }, bgcolor: 'background.paper', boxShadow: 'none' }}
      >
        <Toolbar>
          <Box onClick={() => setMobileOpen(true)} sx={{ cursor: 'pointer' }}>
            <MenuIcon />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}
        open
      >
        {content}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 240 } }}
      >
        {content}
      </Drawer>
    </>
  );
}