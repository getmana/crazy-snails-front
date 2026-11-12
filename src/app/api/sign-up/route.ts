import { cookies } from 'next/headers';

import { readErrorResponse, toErrorJsonResponse, toUnexpectedError } from '@/api/readErrorResponse';
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
            return toErrorJsonResponse(await readErrorResponse(response));
        }
        const responseData = await response.json();

        return Response.json({ message: 'Account is created', data: responseData });
    } catch (e) {
        return toErrorJsonResponse(toUnexpectedError(e));
    }
}
