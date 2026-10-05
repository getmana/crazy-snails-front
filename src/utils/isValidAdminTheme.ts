import { type AdminTheme } from '@/types';

export const isValidAdminTheme = (value: unknown): value is AdminTheme => value === 'dark' || value === 'light';
