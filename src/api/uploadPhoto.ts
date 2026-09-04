import { internalAPIRoutes } from '@/utils';

export const uploadPhoto = async (file: File): Promise<{ photoId: number } | { error: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(internalAPIRoutes.uploadPhoto, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || 'Upload failed' };
        }

        return { photoId: data.photoId };
    } catch {
        return { error: 'Upload failed' };
    }
};
