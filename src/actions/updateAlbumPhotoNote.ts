'use server';

import { fetchWithAuth } from '@/api/authFetch';
import { ErrorResponse } from '@/types';
import type { TiptapDocument } from '@/types/tiptap';
import { getErrorMessage } from '@/utils';

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
            const responseData = await response.json().catch(() => null);
            const message = (responseData as ErrorResponse | null)?.message ?? response.statusText;
            return { message: `Unexpected Error Occured: ${message}` };
        }

        return { message: null };
    } catch (e: unknown) {
        return { message: `Unexpected Error Occured: ${getErrorMessage(e)}` };
    }
};
