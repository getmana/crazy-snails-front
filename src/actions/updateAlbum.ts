'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { ErrorResponse } from '@/types';
import type { TiptapDocument } from '@/types/tiptap';
import { getErrorMessage } from '@/utils';

export type UpdateAlbumPayload = {
    title?: string;
    titleEn?: string;
    titleUk?: string;
    subtitle?: string;
    subtitleEn?: string;
    subtitleUk?: string;
    description?: TiptapDocument;
    descriptionEn?: TiptapDocument;
    descriptionUk?: TiptapDocument;
    isPublished?: boolean;
    countries?: number[];
    startDate?: string;
    endDate?: string;
    activityTypes?: string[];
    previewImageId?: number;
    albumPhotoIds?: number[];
};

export const updateAlbum = async (id: number, payload: UpdateAlbumPayload) => {
    try {
        const response = await fetchWithAuth(`/albums/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const responseData = await response.json();

        if (!response.ok) {
            const { message }: ErrorResponse = responseData;
            return { message: `Unexpected Error Occured: ${message}`, data: null };
        }

        revalidatePath('/[locale]/dashboard/albums/[id]', 'page');
        revalidatePath('/[locale]/dashboard/albums', 'page');

        return { data: responseData, message: null };
    } catch (e: unknown) {
        return { message: `Unexpected Error Occured: ${getErrorMessage(e)}`, data: null };
    }
};

export const updateAlbumWithRedirect = async (id: number, payload: UpdateAlbumPayload) => {
    const { message } = await updateAlbum(id, payload);
    if (message) {
        return message;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/albums/${id}?toast=album-updated`);
};
