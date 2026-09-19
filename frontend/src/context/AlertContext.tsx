import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { setErrorHandler } from '../api/client';

interface AlertItem {
  id: number;
  message: string;
  severity: 'error' | 'success' | 'info' | 'warning';
}

interface AlertContextValue {
  showAlert: (message: string, severity?: AlertItem['severity']) => void;
}

export const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback((message: string, severity: AlertItem['severity'] = 'error') => {
    setAlerts((prev) => [...prev, { id: Date.now() + Math.random(), message, severity }]);
  }, []);

  useEffect(() => {
    setErrorHandler((message) => showAlert(message, 'error'));
  }, [showAlert]);

  const handleClose = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Stack spacing={1} sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        {alerts.map((a) => (
          <Snackbar
            key={a.id}
            open
            autoHideDuration={5000}
            onClose={() => handleClose(a.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ position: 'static' }}
          >
            <Alert severity={a.severity} variant="filled" onClose={() => handleClose(a.id)}>
              {a.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </AlertContext.Provider>
  );
}

