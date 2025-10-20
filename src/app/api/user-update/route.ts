import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { fetchWithAuth } from '@/api/authFetch';
import { SessionData, sessionOptions } from '@/lib';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const cookieStore = await cookies();
        const { user } = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!user) {
            return new Response(JSON.stringify({ message: `Unauthorized. Please sign in. Redirecting...` }), {
                status: 401,
            });
        }

        const response = await fetchWithAuth(`/users/${user.id}` as string, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const responseData = await response.json();
        console.log('update user response ==>', responseData);

        if (!response.ok) {
            const { message, error, statusCode }: ErrorResponse = responseData;
            console.log('error response status code ==>', statusCode);
            return new Response(JSON.stringify({ message: `${error}. ${message}` }), {
                status: statusCode,
            });
        }

        return new Response(JSON.stringify({ message: 'User data is successfully updated', data: responseData }), {
            status: 200,
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: `${getErrorMessage(e)}.` }), {
            status: 500,
        });
    }
}
