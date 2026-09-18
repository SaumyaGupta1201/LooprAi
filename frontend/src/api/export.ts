import { api } from './client';
import { ExportColumn } from '../types';

export const getExportColumns = () =>
  api.get<{ success: boolean; data: ExportColumn[] }>('/export/columns');

export const exportCsv = async (
  columns: string[],
  filters: Record<string, string> = {},
  sortBy?: string,
  order?: string,
  filename?: string
) => {
  const res = await api.post('/export/csv', { columns, filters, sortBy, order, filename }, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  const disposition = res.headers['content-disposition'] as string | undefined;
  const match = disposition?.match(/filename="(.+)"/);
  link.setAttribute('download', match?.[1] || 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};