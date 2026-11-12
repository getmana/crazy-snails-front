import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { toUnauthorizedError } from '@/api/readErrorResponse';
import { HTTP_STATUS } from '@/constants';
import { SessionData, sessionOptions } from '@/lib';

// No public Next.js API to check this by type; matching by message is the documented workaround.
const isReadonlyCookiesError = (error: unknown) => error instanceof Error && error.message.includes('Cookies can only be modified');

const unauthorizedResponse = (message: string) => Response.json(toUnauthorizedError(message), { status: HTTP_STATUS.UNAUTHORIZED });

const refreshAccessToken = async (session: IronSession<SessionData>) => {
    const { user } = session;
    if (!user) {
        return unauthorizedResponse('No active session');
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
        return unauthorizedResponse('Refresh token error');
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

    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
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
