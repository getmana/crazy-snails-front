import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { SessionData, sessionOptions } from '@/lib';

// No public Next.js API to check this by type; matching by message is the documented workaround.
const isReadonlyCookiesError = (error: unknown) => error instanceof Error && error.message.includes('Cookies can only be modified');

const refreshAccessToken = async (session: IronSession<SessionData>) => {
    const { user } = session;
    if (!user) {
        return new Response(JSON.stringify({ message: 'No active session', error: 'Unauthorized', statusCode: 401 }), {
            status: 401,
            statusText: 'failed',
        });
    }

    try {
        const response = await fetch(`${process.env.CS_API}/auth/refresh`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${user.refreshToken}` },
        });

        if (!response.ok) {
            console.error('Refresh token failed');
            try {
                session.destroy();
            } catch (destroyError) {
                if (!isReadonlyCookiesError(destroyError)) throw destroyError;
            }

            return response;
        }

        const { accessToken, refreshToken, id } = await response.json();
        session.user = { accessToken, refreshToken, id };
        try {
            await session.save();
        } catch (saveError) {
            if (!isReadonlyCookiesError(saveError)) throw saveError;
        }

        return response;
    } catch (error) {
        console.error('Refresh token error:', error);
        try {
            const errorSession = await getIronSession<SessionData>(await cookies(), sessionOptions);
            errorSession.destroy();
        } catch (destroyError) {
            if (!isReadonlyCookiesError(destroyError)) throw destroyError;
        }
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
