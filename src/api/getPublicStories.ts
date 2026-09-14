import { PublicStoriesResponse } from '@/types';

export const getPublicStories = async (): Promise<PublicStoriesResponse> => {
    if (!process.env.CS_API) {
        console.error('CS_API is not configured, skipping public stories fetch and falling back to an empty list.');
        return { items: [], nextCursor: null };
    }

    try {
        const response = await fetch(`${process.env.CS_API}/users/${process.env.SITE_OWNER_ID}/stories`);

        if (!response.ok) {
            throw new Error(`Public stories request failed with status ${response.status}`);
        }
        const storiesData: PublicStoriesResponse = await response.json();

        return storiesData;
    } catch (e) {
        console.error('Failed to fetch public stories, falling back to an empty list:', e);
        return { items: [], nextCursor: null };
    }
};
