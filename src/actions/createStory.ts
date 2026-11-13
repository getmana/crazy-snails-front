'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';

export type CreateStoryPayload = {
    title: string;
    titleEn?: string;
    titleUk?: string;
};

export const createStory = async (payload: CreateStoryPayload) => {
    try {
        const response = await fetchWithAuth('/stories', {
            method: 'POST',
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

export const createStoryWithRedirect = async (payload: CreateStoryPayload) => {
    const { data, error } = await createStory(payload);
    if (error) {
        return error;
    }

    const { id } = data;

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/stories/${id}/edit?toast=story-created`);
};
