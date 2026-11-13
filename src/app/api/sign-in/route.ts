import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { readErrorResponse, toErrorJsonResponse, toUnexpectedError } from '@/api/readErrorResponse';
import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from '@/i18n-config';
import { SessionData, sessionOptions } from '@/lib';
import { SignInResponse } from '@/types';
import { isValidAdminTheme, isValidLocale } from '@/utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${process.env.CS_API}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return toErrorJsonResponse(await readErrorResponse(response));
        }
        const responseData = await response.json();

        const { accessToken, refreshToken, id, locale, adminTheme } = responseData as SignInResponse;

        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
        session.user = { accessToken, refreshToken, id };
        await session.save();

        if (locale && isValidLocale(locale)) {
            cookieStore.set(LOCALE_COOKIE_NAME, locale, {
                path: '/',
                maxAge: LOCALE_COOKIE_MAX_AGE,
                sameSite: 'lax',
            });
        }

        return Response.json({
            message: 'Successfully signed in',
            adminTheme: isValidAdminTheme(adminTheme) ? adminTheme : undefined,
        });
    } catch (e) {
        return toErrorJsonResponse(toUnexpectedError(e));
    }
}
