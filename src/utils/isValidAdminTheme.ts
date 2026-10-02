import { AdminTheme } from '@/components/layout/AdminThemeProvider';

export const isValidAdminTheme = (value: unknown): value is AdminTheme => value === 'dark' || value === 'light';
