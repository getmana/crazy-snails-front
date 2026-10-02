'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { fetchWithAuth } from '@/api/authFetch';
import { SessionData, sessionOptions } from '@/lib';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export type UpdateUserPayload = {
    username?: string;
    email?: string;
};

export const updateUser = async (payload: UpdateUserPayload) => {
    try {
        const cookieStore = await cookies();
        const { user } = await getIronSession<SessionData>(cookieStore, sessionOptions);

        if (!user) {
            return { message: 'Unauthorized. Please sign in.', data: null };
        }

        const response = await fetchWithAuth(`/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const responseData = await response.json();

        if (!response.ok) {
            const { message }: ErrorResponse = responseData;
            return { message: `Unexpected Error Occured: ${message}`, data: null };
        }

        return { data: responseData, message: null };
    } catch (e: unknown) {
        return { message: `Unexpected Error Occured: ${getErrorMessage(e)}`, data: null };
    }
};
