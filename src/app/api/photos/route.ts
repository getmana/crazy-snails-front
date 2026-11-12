import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toErrorJsonResponse, toUnauthorizedError, toUnexpectedError } from '@/api/readErrorResponse';
import { SessionData, sessionOptions } from '@/lib';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const cookieStore = await cookies();
        const { user } = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!user) {
            return toErrorJsonResponse(toUnauthorizedError());
        }

        const response = await fetchWithAuth('/photos', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            return toErrorJsonResponse(await readErrorResponse(response));
        }
        const responseData = await response.json();

        return Response.json(responseData);
    } catch (e) {
        return toErrorJsonResponse(toUnexpectedError(e));
    }
}
