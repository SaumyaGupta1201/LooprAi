import { api } from './client';
import { Transaction, Pagination, FilterOptions } from '../types';

export interface TxnParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const getTransactions = (params: TxnParams) =>
  api.get<{ success: boolean; data: Transaction[]; pagination: Pagination }>('/transactions', { params });

export const getFilterOptions = () =>
  api.get<{ success: boolean; data: FilterOptions }>('/transactions/filters');