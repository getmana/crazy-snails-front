import { NextResponse } from 'next/server';

import { MiddlewareFunction } from './index';
import { i18n } from '../../i18n-config';

export const localeMiddleware: MiddlewareFunction = {
    run: (request) => {
        const pathname = request.nextUrl.pathname;
        console.log('pathname=', pathname);

        const pathnameIsMissingLocale = i18n.locales.every((locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);

        if (pathnameIsMissingLocale) {
            return NextResponse.redirect(new URL(`/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
        }

        return NextResponse.next();
    },
    match: '/src/app/[en|uk].*',
};
