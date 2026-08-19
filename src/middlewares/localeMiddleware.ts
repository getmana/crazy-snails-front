import { NextResponse } from 'next/server';

import { i18n, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from '@/i18n-config';
import { getLocaleFromAcceptLanguage, isValidLocale } from '@/utils';

import { MiddlewareFunction } from './index';

export const localeMiddleware: MiddlewareFunction = {
    run: (request) => {
        const pathname = request.nextUrl.pathname;

        const pathnameIsMissingLocale = i18n.locales.every((locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);

        if (!pathnameIsMissingLocale) {
            return NextResponse.next();
        }

        const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
        const hasValidCookie = !!cookieLocale && isValidLocale(cookieLocale);
        const detectedLocale = hasValidCookie ? cookieLocale : getLocaleFromAcceptLanguage(request.headers.get('accept-language'));

        const response = NextResponse.redirect(new URL(`/${detectedLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));

        if (!hasValidCookie) {
            response.cookies.set(LOCALE_COOKIE_NAME, detectedLocale, {
                path: '/',
                maxAge: LOCALE_COOKIE_MAX_AGE,
                sameSite: 'lax',
            });
        }

        return response;
    },
    match: '^/((?!api/|images/|icons/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
};
