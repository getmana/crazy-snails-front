export const i18n = {
    defaultLocale: 'uk',
    locales: ['uk', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const LOCALE_COOKIE_NAME = 'locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
