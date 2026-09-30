'use server';

import { fetchWithAuth } from '@/api/authFetch';
import { type AlbumPhotoNote, ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export const getAlbumPhotoNote = async (albumId: number, photoId: number): Promise<{ note: AlbumPhotoNote | null } | { error: string }> => {
    try {
        const response = await fetchWithAuth(`/albums/${albumId}/photos/${photoId}/note`);

        if (response.status === 404) {
            return { note: null };
        }

        const responseData = await response.json();

        if (!response.ok) {
            const { message }: ErrorResponse = responseData;
            return { error: message || 'Failed to load the note' };
        }

        return { note: responseData };
    } catch (e: unknown) {
        return { error: getErrorMessage(e) };
    }
};
