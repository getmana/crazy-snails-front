import { AdminTheme } from '@/components/common/AdminThemeProvider';

export const isValidAdminTheme = (value: unknown): value is AdminTheme => value === 'dark' || value === 'light';
