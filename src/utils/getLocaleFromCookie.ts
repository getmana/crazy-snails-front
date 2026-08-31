import { i18n, Locale, LOCALE_COOKIE_NAME } from '@/i18n-config';

import { isValidLocale } from './getLocale';

export const getLocaleFromCookie = (): Locale => {
    const match = document.cookie.split('; ').find((entry) => entry.startsWith(`${LOCALE_COOKIE_NAME}=`));
    const value = match ? decodeURIComponent(match.slice(LOCALE_COOKIE_NAME.length + 1)) : undefined;

    return value && isValidLocale(value) ? value : i18n.defaultLocale;
};
