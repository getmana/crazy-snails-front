'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export const deleteStory = async (id: number) => {
    try {
        const response = await fetchWithAuth(`/stories/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            const responseData = await response.json().catch(() => null);
            const message = (responseData as ErrorResponse | null)?.message ?? response.statusText;
            return { message: `Unexpected Error Occured: ${message}` };
        }

        return { message: null };
    } catch (e: unknown) {
        return { message: `Unexpected Error Occured: ${getErrorMessage(e)}` };
    }
};

export const deleteStoryWithRedirect = async (id: number) => {
    const { message } = await deleteStory(id);
    if (message) {
        return message;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/stories?toast=story-deleted`);
};
