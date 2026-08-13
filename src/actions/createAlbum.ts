'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchWithAuth } from '@/api/authFetch';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils';

export type CreateAlbumPayload = {
    title: string;
    titleEn?: string;
    titleUk?: string;
    description: string;
    descriptionEn?: string;
    descriptionUk?: string;
    countries: { code: string }[];
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
        const responseData = await response.json();

        if (!response.ok) {
            const { message }: ErrorResponse = responseData;
            return { message: `Unexpected Error Occured: ${message}`, data: null };
        }

        return { data: responseData, message: null };
    } catch (e: unknown) {
        return { message: `Unexpected Error Occured: ${getErrorMessage(e)}`, data: null };
    }
};

export const createAlbumWithRedirect = async (payload: CreateAlbumPayload) => {
    const { data, message } = await createAlbum(payload);
    if (message) {
        return message;
    }

    const { id } = data;

    const headersList = await headers();
    const locale = headersList.get('x-locale');

    redirect(`/${locale}/dashboard/albums/${id}?toast=created`);
};
