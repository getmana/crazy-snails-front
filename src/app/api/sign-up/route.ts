import { cookies } from 'next/headers';

import { i18n, LOCALE_COOKIE_NAME } from '@/i18n-config';
import { ErrorResponse } from '@/types';
import { isValidLocale } from '@/utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const cookieStore = await cookies();
        const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
        const locale = cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : i18n.defaultLocale;

        const response = await fetch(`${process.env.CS_API}/users` as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...body, locale }),
        });
        const responseData = await response.json();
        console.log('sign-up response ==>', responseData);

        if (!response.ok) {
            const { message, error, statusCode }: ErrorResponse = responseData;
            return new Response(JSON.stringify({ message: `${error}. ${message}` }), {
                status: statusCode,
            });
        }

        return new Response(JSON.stringify({ message: 'Account is created', data: responseData }), {
            status: 200,
        });
    } catch (e) {
        console.log('CATCHHHHH======', e);
    }
}
