'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export type UpdateStoryPayload = {
    title?: string;
    titleEn?: string;
    titleUk?: string;
    description?: string;
    descriptionEn?: string;
    descriptionUk?: string;
    heroFirst?: boolean;
    heroImageId?: number | null;
    pairPhotoIds?: number[];
    galleryPhotoIds?: number[];
    carouselPhotoIds?: number[];
    isPublished?: boolean;
};

export const updateStory = async (id: number, payload: UpdateStoryPayload) => {
    try {
        const response = await fetchWithAuth(`/stories/${id}`, {
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

export const updateStoryWithRedirect = async (id: number, payload: UpdateStoryPayload) => {
    const { message } = await updateStory(id, payload);
    if (message) {
        return message;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/stories/${id}?toast=story-updated`);
};
