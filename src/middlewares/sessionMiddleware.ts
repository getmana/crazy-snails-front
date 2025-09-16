import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { i18n } from '@/i18n-config';
import { SessionData, sessionOptions } from '@/lib';
import { getLocaleFromPathname } from '@/utils';

import { MiddlewareFunction } from './index';

export const sessionMiddleware: MiddlewareFunction = {
    run: async (request) => {
        const cookieStore = await cookies();
        const session: SessionData = await getIronSession(cookieStore, sessionOptions);

        const { pathname } = request.nextUrl;

        const locale = getLocaleFromPathname(pathname);

        if (pathname.includes('/dashboard') && !session.user?.accessToken) {
            const loginUrl = new URL(`/${locale}/signin`, request.url);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    },
    match: '/((?!api|_next/static|_next/image|favicon.ico).*/dashboard.*)',
};
