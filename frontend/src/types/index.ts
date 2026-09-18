export interface Transaction {
  _id: string;
  txnId: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  userName: string;
  avatar: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  categories: string[];
  statuses: string[];
  users: { user_id: string; name: string; avatar: string }[];
  amountRange: { min: number; max: number };
}

export interface Summary {
  revenue: number;
  expenses: number;
  balance: number;
  savings: number;
  savingsRate: number;
  pendingRevenue: number;
  pendingExpenses: number;
  transactionCount: number;
}

export interface TrendPoint {
  key: string;
  label: string;
  revenue: number;
  expenses: number;
  net: number;
}

export interface Breakdown {
  byCategory: { name: string; total: number; count: number }[];
  byStatus: { name: string; total: number; count: number }[];
  byUser: { name: string; revenue: number; expenses: number }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface ExportColumn {
  key: string;
  label: string;
}