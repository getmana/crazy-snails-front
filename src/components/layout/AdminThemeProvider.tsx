'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

export type AdminTheme = 'dark' | 'light';

export const ADMIN_THEME_STORAGE_KEY = 'admin-theme';

export const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

    return (
        <ThemeProvider attribute="class" enableSystem defaultTheme="system" storageKey={ADMIN_THEME_STORAGE_KEY}>
            {children}
        </ThemeProvider>
    );
};
