'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';

export const deleteAlbum = async (id: number) => {
    try {
        const response = await fetchWithAuth(`/albums/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            return { error: await readErrorResponse(response) };
        }

        revalidatePath('/[locale]/dashboard/albums', 'page');

        return { error: null };
    } catch (e: unknown) {
        return { error: toUnexpectedError(e) };
    }
};

export const deleteAlbumWithRedirect = async (id: number) => {
    const { error } = await deleteAlbum(id);
    if (error) {
        return error;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/albums?toast=album-deleted`);
};
