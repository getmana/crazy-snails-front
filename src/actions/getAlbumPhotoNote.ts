'use server';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';
import { API_ERROR_CODES } from '@/constants';
import { type AlbumPhotoNote, type ErrorResponse } from '@/types';

export const getAlbumPhotoNote = async (
    albumId: number,
    photoId: number,
): Promise<{ note: AlbumPhotoNote | null } | { error: ErrorResponse }> => {
    try {
        const response = await fetchWithAuth(`/albums/${albumId}/photos/${photoId}/note`);

        if (!response.ok) {
            const error = await readErrorResponse(response);
            return error.code === API_ERROR_CODES.NOTE_NOT_FOUND ? { note: null } : { error };
        }

        return { note: await response.json() };
    } catch (e: unknown) {
        return { error: toUnexpectedError(e) };
    }
};
