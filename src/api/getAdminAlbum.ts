import { notFound } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { Album } from '@/types';

export const getAdminAlbum = async (id: string): Promise<Album> => {
    const response = await fetchWithAuth(`/albums/${id}`);
    if (response.status === 404) {
        notFound();
    }
    return response.json();
};
