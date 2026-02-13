import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { MiddlewareFunction } from '@/middlewares';
import { getLocaleFromPathname } from '@/utils';

export const pathnameMiddleware: MiddlewareFunction = {
    run: (request: NextRequest, response: NextResponse) => {
        const pathname = request.nextUrl.pathname;
        const searchString = request.nextUrl.search;
        response.headers.set('x-pathname', pathname);
        response.headers.set('x-search', searchString);
        response.headers.set('x-locale', getLocaleFromPathname(pathname));

        return response;
    },
    match: '/((?!api|favicon.ico).*)',
};
