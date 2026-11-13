'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';
import type { TiptapDocument } from '@/types/tiptap';

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
        if (!response.ok) {
            return { data: null, error: await readErrorResponse(response) };
        }
        const responseData = await response.json();

        revalidatePath('/[locale]/dashboard/albums/[id]', 'page');
        revalidatePath('/[locale]/dashboard/albums', 'page');

        return { data: responseData, error: null };
    } catch (e: unknown) {
        return { data: null, error: toUnexpectedError(e) };
    }
};

export const updateAlbumWithRedirect = async (id: number, payload: UpdateAlbumPayload) => {
    const { error } = await updateAlbum(id, payload);
    if (error) {
        return error;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/albums/${id}?toast=album-updated`);
};
