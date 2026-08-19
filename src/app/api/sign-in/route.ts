import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { isValidAdminTheme } from '@/components/common/AdminThemeProvider';
import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from '@/i18n-config';
import { SessionData, sessionOptions } from '@/lib';
import { ErrorResponse, SignInResponse } from '@/types';
import { isValidLocale } from '@/utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('body', body);

        const response = await fetch(`${process.env.CS_API}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const responseData = await response.json();

        if (!response.ok) {
            const { message, error, statusCode }: ErrorResponse = responseData;
            return new Response(JSON.stringify({ message: `${error}. ${message}` }), {
                status: statusCode,
            });
        }
        console.log('sign in data ==> ', responseData);

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

        return new Response(
            JSON.stringify({
                message: 'Successfully signed in',
                adminTheme: isValidAdminTheme(adminTheme) ? adminTheme : undefined,
            }),
            { status: 200 },
        );
    } catch (e) {
        console.log('CATCHHHHH======', e);
    }
}
