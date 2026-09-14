import { PublicAlbumsResponse } from '@/types';

export const getPublicAlbums = async (): Promise<PublicAlbumsResponse> => {
    if (!process.env.CS_API) {
        console.error('CS_API is not configured, skipping public albums fetch and falling back to an empty list.');
        return { items: [], nextCursor: null };
    }

    try {
        const response = await fetch(`${process.env.CS_API}/users/${process.env.SITE_OWNER_ID}/albums`);
        if (!response.ok) {
            throw new Error(`Public albums request failed with status ${response.status}`);
        }
        const albumsData: any = await response.json();

        return albumsData;
    } catch (e) {
        console.error('Failed to fetch public albums, falling back to an empty list:', e);
        return { items: [], nextCursor: null };
    }
};
