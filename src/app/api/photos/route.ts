import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnauthorizedError, toUnexpectedError } from '@/api/readErrorResponse';
import { HTTP_STATUS } from '@/constants';
import { SessionData, sessionOptions } from '@/lib';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const cookieStore = await cookies();
        const { user } = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!user) {
            return Response.json(toUnauthorizedError(), { status: HTTP_STATUS.UNAUTHORIZED });
        }

        const response = await fetchWithAuth('/photos', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await readErrorResponse(response);
            return Response.json(error, { status: error.statusCode });
        }
        const responseData = await response.json();

        return new Response(JSON.stringify(responseData), {
            status: 200,
        });
    } catch (e) {
        const error = toUnexpectedError(e);
        return Response.json(error, { status: error.statusCode });
    }
}
