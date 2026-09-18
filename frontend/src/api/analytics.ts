import { api } from './client';
import { Summary, TrendPoint, Breakdown, Transaction } from '../types';

export const getSummary = (params: Record<string, string> = {}) =>
  api.get<{ success: boolean; data: Summary }>('/analytics/summary', { params });

export const getTrend = (params: Record<string, string> = {}) =>
  api.get<{ success: boolean; data: TrendPoint[] }>('/analytics/trend', { params });

export const getBreakdown = (params: Record<string, string> = {}) =>
  api.get<{ success: boolean; data: Breakdown }>('/analytics/breakdown', { params });

export const getRecent = (limit = 5) =>
  api.get<{ success: boolean; data: Transaction[] }>('/analytics/recent', { params: { limit } });