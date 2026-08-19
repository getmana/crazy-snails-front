'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { internalAPIRoutes } from '@/utils';

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

    const handleClick = () => {
        const nextTheme = isDark ? 'light' : 'dark';
        setTheme(nextTheme);

        fetch(internalAPIRoutes.editUser, {
            method: 'PATCH',
            body: JSON.stringify({ adminTheme: nextTheme }),
        }).catch(() => {});
    };

    return (
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={handleClick}>
            {isDark ? <Sun /> : <Moon />}
        </Button>
    );
};
