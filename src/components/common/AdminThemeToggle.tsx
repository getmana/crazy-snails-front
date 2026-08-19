'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export const AdminThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled />;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark ? <Sun /> : <Moon />}
        </Button>
    );
};
