import { Locale } from '@/i18n-config';

import { isValidLocale } from './getLocale';

export const getPathWithLocale = (pathname: string, newLocale: Locale): string => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length && isValidLocale(segments[0])) {
        segments[0] = newLocale;
    } else {
        segments.unshift(newLocale);
    }

    return `/${segments.join('/')}`;
};
