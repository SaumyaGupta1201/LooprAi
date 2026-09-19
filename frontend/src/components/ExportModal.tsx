  import { useEffect, useState } from 'react';
  import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormGroup, FormControlLabel, Checkbox, TextField, Box, Typography, Chip, Stack } from '@mui/material';
  import { getExportColumns, exportCsv } from '../api/export';
  import { ExportColumn } from '../types';
  import { useAlert } from '../context/useAlert';

  interface Props {
    open: boolean;
    onClose: () => void;
    filters: Record<string, string>;
    sortBy: string;
    order: string;
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

  const describeFilters = (filters: Record<string, string>): string => {
    const { startDate, endDate } = filters;
    if (startDate && endDate) return `${formatDate(startDate)} – ${formatDate(endDate)}`;
    if (startDate) return `From ${formatDate(startDate)} onward`;
    if (endDate) return `Up to ${formatDate(endDate)}`;
    return 'All time';
  };

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

    const activeChips = [
      filters.category && { label: `Category: ${filters.category}` },
      filters.status && { label: `Status: ${filters.status}` },
      filters.search && { label: `Search: "${filters.search}"` },
      filters.minAmount && { label: `Min $${filters.minAmount}` },
      filters.maxAmount && { label: `Max $${filters.maxAmount}` },
    ].filter(Boolean) as { label: string }[];

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
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Exporting transactions for
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {describeFilters(filters)}
          </Typography>
          {activeChips.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
              {activeChips.map((c) => (
                <Chip key={c.label} label={c.label} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Box>
        <TextField label="File name (optional)" fullWidth size="small" value={filename}
          onChange={(e) => setFilename(e.target.value)} sx={{ mb: 2 }} />
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