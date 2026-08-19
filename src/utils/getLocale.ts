import { i18n, Locale } from '@/i18n-config';

export const isValidLocale = (value: string): value is Locale => i18n.locales.includes(value as Locale);

export const getLocaleFromPathname = (pathname: string): Locale => {
    const [potentialLocale] = pathname.split('/').filter((x) => x);
    const locale = isValidLocale(potentialLocale) ? potentialLocale : i18n.defaultLocale;

    return locale;
};

export const getLocaleFromAcceptLanguage = (acceptLanguage: string | null): Locale => {
    if (!acceptLanguage) return i18n.defaultLocale;

    const preferred = acceptLanguage
        .split(',')
        .map((part) => {
            const [tag, qPart] = part.trim().split(';q=');
            return { tag: tag.split('-')[0].toLowerCase(), q: qPart ? parseFloat(qPart) : 1 };
        })
        .sort((a, b) => b.q - a.q);

    const match = preferred.find((entry) => isValidLocale(entry.tag));

    return match ? (match.tag as Locale) : i18n.defaultLocale;
};
