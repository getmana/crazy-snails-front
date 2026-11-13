'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';

export const deleteStory = async (id: number) => {
    try {
        const response = await fetchWithAuth(`/stories/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            return { error: await readErrorResponse(response) };
        }

        revalidatePath('/[locale]/dashboard/stories', 'page');

        return { error: null };
    } catch (e: unknown) {
        return { error: toUnexpectedError(e) };
    }
};

export const deleteStoryWithRedirect = async (id: number) => {
    const { error } = await deleteStory(id);
    if (error) {
        return error;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/stories?toast=story-deleted`);
};
