'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { readErrorResponse, toUnexpectedError } from '@/api/readErrorResponse';

export type CreateAlbumPayload = {
    title: string;
    titleEn?: string;
    titleUk?: string;
    countries: number[];
    activityTypes: string[];
    startDate: string;
    endDate: string;
};

export const createAlbum = async (payload: CreateAlbumPayload) => {
    try {
        const response = await fetchWithAuth('/albums', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            return { data: null, error: await readErrorResponse(response) };
        }
        const responseData = await response.json();

        return { data: responseData, error: null };
    } catch (e: unknown) {
        return { data: null, error: toUnexpectedError(e) };
    }
};

export const createAlbumWithRedirect = async (payload: CreateAlbumPayload) => {
    const { data, error } = await createAlbum(payload);
    if (error) {
        return error;
    }

    const { id } = data;

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/albums/${id}/edit?toast=album-created`);
};
