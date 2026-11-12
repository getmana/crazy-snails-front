import { notFound } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse } from '@/api/readErrorResponse';
import { HTTP_STATUS } from '@/constants';
import { Story } from '@/types';

export const getAdminStory = async (id: string): Promise<Story> => {
    const response = await fetchWithAuth(`/stories/${id}`);
    if (response.status === HTTP_STATUS.NOT_FOUND) {
        notFound();
    }
    if (!response.ok) {
        const { code } = await readErrorResponse(response);
        throw new Error(code);
    }
    return response.json();
};
