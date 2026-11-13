'use server';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';
import type { TiptapDocument } from '@/types/tiptap';

export type UpdateAlbumPhotoNotePayload = {
    title?: string | null;
    titleEn?: string | null;
    titleUk?: string | null;
    description: TiptapDocument;
    descriptionEn?: TiptapDocument | null;
    descriptionUk?: TiptapDocument | null;
    country?: number | null;
    date?: string | null;
};

export const updateAlbumPhotoNote = async (albumId: number, photoId: number, payload: UpdateAlbumPhotoNotePayload) => {
    try {
        const response = await fetchWithAuth(`/albums/${albumId}/photos/${photoId}/note`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return { error: await readErrorResponse(response) };
        }

        return { error: null };
    } catch (e: unknown) {
        return { error: toUnexpectedError(e) };
    }
};
