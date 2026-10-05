'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

export const ADMIN_THEME_STORAGE_KEY = 'admin-theme';

type AdminThemeProviderProps = { children: React.ReactNode };

export const AdminThemeProvider = ({ children }: AdminThemeProviderProps) => {
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
