import { notFound } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse } from '@/api/readErrorResponse';
import { HTTP_STATUS } from '@/constants';
import { Album } from '@/types';

export const getAdminAlbum = async (id: string): Promise<Album> => {
    const response = await fetchWithAuth(`/albums/${id}`);
    if (response.status === HTTP_STATUS.NOT_FOUND) {
        notFound();
    }
    if (!response.ok) {
        const { code } = await readErrorResponse(response);
        throw new Error(code);
    }
    return response.json();
};
