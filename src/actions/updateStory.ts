'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';
import { CarouselPhotoInput } from '@/types';
import type { TiptapDocument } from '@/types/tiptap';

export type UpdateStoryPayload = {
    title?: string;
    titleEn?: string;
    titleUk?: string;
    subtitle?: string;
    subtitleEn?: string;
    subtitleUk?: string;
    description?: TiptapDocument;
    descriptionEn?: TiptapDocument;
    descriptionUk?: TiptapDocument;
    heroFirst?: boolean;
    heroImageId?: number | null;
    pairPhotoIds?: number[];
    galleryPhotoIds?: number[];
    carouselPhotos?: CarouselPhotoInput[];
    isPublished?: boolean;
};

export const updateStory = async (id: number, payload: UpdateStoryPayload) => {
    try {
        const response = await fetchWithAuth(`/stories/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            return { data: null, error: await readErrorResponse(response) };
        }
        const responseData = await response.json();

        revalidatePath('/[locale]/dashboard/stories/[id]', 'page');
        revalidatePath('/[locale]/dashboard/stories', 'page');

        return { data: responseData, error: null };
    } catch (e: unknown) {
        return { data: null, error: toUnexpectedError(e) };
    }
};

export const updateStoryWithRedirect = async (id: number, payload: UpdateStoryPayload) => {
    const { error } = await updateStory(id, payload);
    if (error) {
        return error;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/stories/${id}?toast=story-updated`);
};
