import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormGroup, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { getExportColumns, exportCsv } from '../api/export';
import { ExportColumn } from '../types';
import { useAlert } from '../context/AlertContext';

interface Props {
  open: boolean;
  onClose: () => void;
  filters: Record<string, string>;
  sortBy: string;
  order: string;
}

export function ExportModal({ open, onClose, filters, sortBy, order }: Props) {
  const [columns, setColumns] = useState<ExportColumn[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!open) return;
    getExportColumns().then((res) => {
      setColumns(res.data.data);
      setSelected(res.data.data.map((c) => c.key));
    });
  }, [open]);

  const toggle = (key: string) => {
    setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const handleExport = async () => {
    if (!selected.length) { showAlert('Select at least one column', 'warning'); return; }
    setLoading(true);
    try {
      await exportCsv(selected, filters, sortBy, order, filename || undefined);
      showAlert('CSV downloaded', 'success');
      onClose();
    } catch {
      /* handled globally */
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Configure CSV Export</DialogTitle>
      <DialogContent>
        <TextField label="File name (optional)" fullWidth size="small" value={filename}
          onChange={(e) => setFilename(e.target.value)} sx={{ mb: 2, mt: 1 }} />
        <FormGroup>
          {columns.map((c) => (
            <FormControlLabel
              key={c.key}
              control={<Checkbox checked={selected.includes(c.key)} onChange={() => toggle(c.key)} />}
              label={c.label}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleExport} disabled={loading}>
          {loading ? 'Exporting...' : 'Download CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}