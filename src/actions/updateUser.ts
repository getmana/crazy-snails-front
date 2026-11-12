'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnauthorizedError, toUnexpectedError } from '@/api/readErrorResponse';
import { SessionData, sessionOptions } from '@/lib';

export type UpdateUserPayload = {
    username?: string;
    email?: string;
};

export const updateUser = async (payload: UpdateUserPayload) => {
    try {
        const cookieStore = await cookies();
        const { user } = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!user) {
            return { data: null, error: toUnauthorizedError() };
        }

        const response = await fetchWithAuth(`/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            return { data: null, error: await readErrorResponse(response) };
        }
        const responseData = await response.json();

        return { data: responseData, error: null };
    } catch (e: unknown) {
        return { data: null, error: toUnexpectedError(e) };
    }
};
