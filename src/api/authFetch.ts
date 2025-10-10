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
            throw new Error('Refresh token failed');
        }

        const { accessToken, refreshToken, id } = await response.json();
        session.user = { accessToken, refreshToken, id };
        await session.save();
    } catch (error) {
        console.error('Refresh token error:', error);
        const errorSession = await getIronSession<SessionData>(await cookies(), sessionOptions);
        errorSession.destroy();
        // window.location.href = '/login'; // TODO redirect with Next
    }
};

let refreshInProgress: Promise<void> | null = null;

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

        await refreshInProgress;

        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${session.user?.accessToken}`,
        };
        response = await fetch(`${process.env.CS_API}${url}`, options);
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Revalidate the session path after successful response??
    // revalidatePath('/');

    return response;
};
