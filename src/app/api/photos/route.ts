import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { fetchWithAuth } from '@/api/authFetch';
import { SessionData, sessionOptions } from '@/lib';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const cookieStore = await cookies();
        const { user } = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!user) {
            return new Response(JSON.stringify({ message: `Unauthorized. Please sign in. Redirecting...` }), {
                status: 401,
            });
        }

        const response = await fetchWithAuth('/photos', {
            method: 'POST',
            body: formData,
        });
        const responseData = await response.json();

        if (!response.ok) {
            const { message, error, statusCode }: ErrorResponse = responseData;
            return new Response(JSON.stringify({ message: `${error}. ${message}` }), {
                status: statusCode,
            });
        }

        return new Response(JSON.stringify(responseData), {
            status: 200,
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: `${getErrorMessage(e)}.` }), {
            status: 500,
        });
    }
}
