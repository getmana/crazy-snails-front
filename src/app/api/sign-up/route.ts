import { cookies } from 'next/headers';

import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';
import { i18n, LOCALE_COOKIE_NAME } from '@/i18n-config';
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
        if (!response.ok) {
            const error = await readErrorResponse(response);
            return Response.json(error, { status: error.statusCode });
        }
        const responseData = await response.json();
        console.log('sign-up response ==>', responseData);

        return new Response(JSON.stringify({ message: 'Account is created', data: responseData }), {
            status: 200,
        });
    } catch (e) {
        const error = toUnexpectedError(e);
        return Response.json(error, { status: error.statusCode });
    }
}
