import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';
import { type ErrorResponse } from '@/types';
import { internalAPIRoutes } from '@/utils';

export const uploadPhoto = async (file: File): Promise<{ photoId: number } | { error: ErrorResponse }> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(internalAPIRoutes.uploadPhoto, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            return { error: await readErrorResponse(response) };
        }
        const data = await response.json();

        return { photoId: data.photoId };
    } catch (e) {
        return { error: toUnexpectedError(e) };
    }
};
