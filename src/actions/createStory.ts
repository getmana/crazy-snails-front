'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

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

export const createStoryWithRedirect = async (payload: CreateStoryPayload) => {
    const { data, message } = await createStory(payload);
    if (message) {
        return message;
    }

    const { id } = data;

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/stories/${id}?toast=story-created`);
};
