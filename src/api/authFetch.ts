import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { SessionData, sessionOptions } from '@/lib';

const refreshAccessToken = async (session: IronSession<SessionData>) => {
    try {
        const response = await fetch(`${process.env.CS_API}/auth/refresh`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.user.refreshToken}` },
        });

        if (!response.ok) {
            console.error('Refresh token failed');
            session.destroy();

            return response;
        }

        const { accessToken, refreshToken, id } = await response.json();
        session.user = { accessToken, refreshToken, id };
        await session.save();

        return response;
    } catch (error) {
        console.error('Refresh token error:', error);
        const errorSession = await getIronSession<SessionData>(await cookies(), sessionOptions);
        errorSession.destroy();
        return new Response(JSON.stringify({ message: 'Refresh token error', error: 'Unauthorized', statusCode: 401 }), {
            status: 401,
            statusText: 'failed',
        });
    }
};

let refreshInProgress: Promise<Response> | null = null;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    const accessToken = session.user?.accessToken;

    if (accessToken) {
        options.headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`,
        };
    }

    let response = await fetch(`${process.env.CS_API}${url}`, options);

    if (response.status === 401) {
        if (!refreshInProgress) {
            refreshInProgress = refreshAccessToken(session).finally(() => {
                refreshInProgress = null;
            });
        }

        const refreshResponse = await refreshInProgress;

        if (!refreshResponse.ok) {
            return refreshResponse;
        }

        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${session.user?.accessToken}`,
        };
        response = await fetch(`${process.env.CS_API}${url}`, options);
    }

    return response;
};
