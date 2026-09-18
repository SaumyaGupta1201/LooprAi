import { api } from './client';
import { User } from '../types';

export const login = (email: string, password: string) =>
  api.post<{ success: boolean; token: string; user: User }>('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const me = () => api.get<{ success: boolean; user: User }>('/auth/me');