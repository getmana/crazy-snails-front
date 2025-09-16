import { i18n, Locale } from '@/i18n-config';

export const isValidLocale = (value: string): value is Locale => i18n.locales.includes(value as Locale);

export const getLocaleFromPathname = (pathname: string): Locale => {
    const [potentialLocale] = pathname.split('/').filter((x) => x);
    const locale = isValidLocale(potentialLocale) ? potentialLocale : i18n.defaultLocale;

    return locale;
};
