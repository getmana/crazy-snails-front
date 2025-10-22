import { NextRequest, NextResponse } from 'next/server';

import { localeMiddleware } from './localeMiddleware';
import { refreshTokenMiddleware } from './refreshTokenMiddleware';
import { sessionMiddleware } from './sessionMiddleware';

export type MiddlewareFunction = {
    run: (request: NextRequest, response: NextResponse) => NextResponse | Promise<NextResponse>;
    match?: string | RegExp;
};

export const middlewares: MiddlewareFunction[] = [localeMiddleware, sessionMiddleware, refreshTokenMiddleware];
