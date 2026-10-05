import { notFound } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { Story } from '@/types';

export const getAdminStory = async (id: string): Promise<Story> => {
    const response = await fetchWithAuth(`/stories/${id}`);
    if (response.status === 404) {
        notFound();
    }
    return response.json();
};
