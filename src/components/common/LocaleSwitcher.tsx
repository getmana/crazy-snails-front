'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { i18n, Locale, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from '@/i18n-config';
import { getPathWithLocale, internalAPIRoutes } from '@/utils';

type LocaleSwitcherProps = {
    locale: Locale;
    className?: string;
};

export const LocaleSwitcher = ({ locale, className = '' }: LocaleSwitcherProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleChange = (nextLocale: string) => {
        if (!nextLocale || nextLocale === locale) return;
        const typedLocale = nextLocale as Locale;

        document.cookie = `${LOCALE_COOKIE_NAME}=${typedLocale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
        router.replace(getPathWithLocale(pathname, typedLocale));

        fetch(internalAPIRoutes.editUser, {
            method: 'PATCH',
            body: JSON.stringify({ locale: typedLocale }),
        }).catch(() => {});
    };

    return (
        <ToggleGroup type="single" value={locale} onValueChange={handleChange} className={className}>
            {i18n.locales.map((locale) => (
                <ToggleGroupItem key={locale} value={locale} aria-label={locale} className="text-xs font-extrabold uppercase">
                    {locale}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};
