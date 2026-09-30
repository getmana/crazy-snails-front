'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export const deleteAlbum = async (id: number) => {
    try {
        const response = await fetchWithAuth(`/albums/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            const responseData = await response.json().catch(() => null);
            const message = (responseData as ErrorResponse | null)?.message ?? response.statusText;
            return { message: `Unexpected Error Occured: ${message}` };
        }

        revalidatePath('/[locale]/dashboard/albums', 'page');

        return { message: null };
    } catch (e: unknown) {
        return { message: `Unexpected Error Occured: ${getErrorMessage(e)}` };
    }
};

export const deleteAlbumWithRedirect = async (id: number) => {
    const { message } = await deleteAlbum(id);
    if (message) {
        return message;
    }

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/albums?toast=album-deleted`);
};
