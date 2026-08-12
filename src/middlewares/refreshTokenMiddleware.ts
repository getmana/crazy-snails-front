import { getIronSession, IronSession } from 'iron-session';
import { decodeJwt } from 'jose/jwt/decode';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SessionData, sessionOptions } from '@/lib';
import { getLocaleFromPathname } from '@/utils';

import { MiddlewareFunction } from './index';

const TIME_TO_REFRESH_TOKEN = 120; // 2min

export const refreshTokenMiddleware: MiddlewareFunction = {
    run: async (request) => {
        console.log('refresh middleware runs**************');
        const cookieStore = await cookies();
        const session: IronSession<SessionData> = await getIronSession(cookieStore, sessionOptions);

        if (session.user?.accessToken) {
            const payload = decodeJwt(session.user.accessToken);
            const { exp } = payload;
            const currentTime = Math.floor(Date.now() / 1000);
            const remainingTime = exp ? exp - currentTime : 0;

            if (remainingTime < TIME_TO_REFRESH_TOKEN) {
                const { pathname } = request.nextUrl;

                const locale = getLocaleFromPathname(pathname);
                try {
                    const response = await fetch(`${process.env.CS_API}/auth/refresh`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${session.user.refreshToken}` },
                    });
                    console.log('refreshing in middleware=============================');

                    if (!response.ok) {
                        console.error('Refresh token failed');
                        session.destroy();
                        await session.save();

                        return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
                    }

                    const { accessToken, refreshToken, id } = await response.json();
                    session.user = { accessToken, refreshToken, id };
                    await session.save();
                } catch (e) {
                    session.destroy();
                    await session.save();

                    return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
                }
            }
        }

        return NextResponse.next();
    },
    match: '/((?!api|_next/static|_next/image|favicon.ico).*/dashboard.*)',
};
