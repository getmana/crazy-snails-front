'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

export const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

    return (
        <ThemeProvider attribute="class" enableSystem defaultTheme="system" storageKey="admin-theme">
            {children}
        </ThemeProvider>
    );
};
