import { Box, InputBase, Avatar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  search: string;
  onSearchChange: (v: string) => void;
}

export function Topbar({ search, onSearchChange }: TopbarProps) {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, py: 2.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 2, px: 1.5, py: 0.5 }}>
          <SearchIcon fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
          <InputBase
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ color: 'inherit' }}
          />
        </Box>
        <Avatar src={user?.avatar} alt={user?.name}>
          {user?.name?.[0]}
        </Avatar>
      </Box>
    </Box>
  );
}