import { NextResponse } from 'next/server';

import { i18n } from '@/i18n-config';

import { MiddlewareFunction } from './index';

export const localeMiddleware: MiddlewareFunction = {
    run: (request) => {
        const pathname = request.nextUrl.pathname;

        const pathnameIsMissingLocale = i18n.locales.every((locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);

        if (pathnameIsMissingLocale) {
            return NextResponse.redirect(new URL(`/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
        }

        return NextResponse.next();
    },
    match: '^/((?!api/|images/|icons/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
};
